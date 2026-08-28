import React, { useCallback, useContext, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ShowImage from "../../utils/ShowImage";
import axios from "axios";
import getHeaderObject from "../../utils/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import AuthContext from "../../Contexts/AuthContext/authContext";

// Canvas helper — crops the image based on pixel coordinates from react-easy-crop
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/jpeg"),
  );
}

const uploadCover = async (imageFile) => {
  const formData = new FormData();
  formData.append("cover", imageFile);
  return axios.put(
    "https://route-posts.routemisr.com/users/upload-cover",
    formData,
    getHeaderObject(),
  );
};

const ProfileCover = () => {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const queryClient = useQueryClient();
  const UserData = useContext(AuthContext);
  const handleOpen = useCallback(() => setShowImageViewer(true), []);

  // --- crop modal state (mirrors ProfilePhoto) ---
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadCover,
    onSuccess: (res) => {
      toast.success(res.data.message);
      setShowModal(false);
      queryClient.invalidateQueries(["profileData"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const profileCover = UserData?.profileData?.cover;
  const imageInfo = useMemo(() => ({ photo: profileCover }), [profileCover]);

  function handleCoverChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setShowModal(true);
  }

  async function handleUpload() {
    const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], file.name, {
      type: "image/jpeg",
    });
    mutate(croppedFile);
  }

  return (
    <>
      <div className="group/cover relative flex items-center justify-center overflow-hidden h-44 sm:h-52 lg:h-80 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)]">
        {profileCover ? (
          <img
            onClick={handleOpen}
            src={profileCover}
            alt="default image"
            className="cursor-pointer w-full"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]"></div>
            <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl"></div>
            <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl"></div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent"></div>
          </>
        )}

        <label className="absolute right-10 top-5 z-10 flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/45 px-2 py-1 mt-20 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:px-3 sm:py-1.5 sm:text-xs">
          <FontAwesomeIcon icon={faCamera} />
          {profileCover ? "Change cover" : "Add cover"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isPending}
            onChange={handleCoverChange}
          />
        </label>
      </div>

      {/* CROP MODAL */}
      {showModal && (
        <div className="fixed inset-0 top-0 left-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[90vw] max-w-2xl dark:bg-slate-900">
            <h2 className="text-xl font-bold mb-3 dark:text-white">
              Adjust cover photo
            </h2>

            <div className="relative w-full h-64 sm:h-80 bg-gray-200 rounded-lg overflow-hidden dark:bg-slate-800">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={16 / 6}
                cropShape="rect"
                objectFit="cover"
                minZoom={0.2}
                maxZoom={3}
                restrictPosition={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
              />
            </div>

            <div className="mt-4">
              <p className="text-sm mb-1 dark:text-slate-300">Zoom</p>
              <input
                type="range"
                min={0.4}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {isPending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Uploading...
                  </>
                ) : (
                  "Save cover"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ShowImage
        showImageViewer={showImageViewer}
        setShowImageViewer={setShowImageViewer}
        Info={imageInfo}
      />
    </>
  );
};

export default React.memo(ProfileCover);
