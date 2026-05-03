import {
  faCamera,
  faExpand,
  faSpinner,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import getHeaderObject from "../../utils/headerObject";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cropper, { getCroppedImg } from "react-easy-crop";
import ShowImage from "../../utils/ShowImage";

const uploadPhoto = async (imageFile) => {
  const formData = new FormData();
  formData.append("photo", imageFile);
  return axios.put(
    "https://route-posts.routemisr.com/users/upload-photo",
    formData,
    getHeaderObject(),
  );
};

const ProfilePhoto = ({ photo, name, username }) => {
  const queryClient = useQueryClient();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      setShowModal(false);
      queryClient.invalidateQueries(["profileData"]);
    },
  });

  function handlePhotoChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setShowModal(true);
  }

  async function handleUpload() {
    // getCroppedImg from react-easy-crop handles all the canvas logic for us
    const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], file.name, {
      type: "image/jpeg",
    });
    mutate(croppedFile);
  }

  return (
    <>
      {/* PROFILE INFO */}
      <div className="group/avatar relative shrink-0 flex items-end gap-4">
        <div className="relative shrink-0">
          <button type="button" className="cursor-zoom-in rounded-full">
            <img
              alt={name}
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-blue-100"
              src={photo}
            />
          </button>

          <button
            onClick={() => setShowImageViewer(true)}
            type="button"
            className="absolute bottom-1 left-1 cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>

          <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700">
            <FontAwesomeIcon icon={faCamera} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        <div>
          <h2 className="truncate text-2xl font-black text-slate-900 sm:text-4xl">
            {name || "Loading..."}
          </h2>
          <p className="mt-1 text-lg font-semibold text-slate-500">
            @{username || "loading_username"}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
            <FontAwesomeIcon icon={faUsers} />
            Route Posts member
          </div>
        </div>
      </div>

      {/* CROP MODAL */}
      {showModal && (
        <div className="fixed -top-25 start-[50%] translate-x-[-50%] z-50 flex items-center justify-center shadow-2xl">
          <div className="bg-white rounded-xl p-6 w-105">
            <h2 className="text-xl font-bold mb-3">Adjust profile photo</h2>

            <div className="relative w-full h-75 bg-gray-200 rounded-lg overflow-hidden">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
              />
            </div>

            <div className="mt-4">
              <p className="text-sm mb-1">Zoom</p>
              <input
                type="range"
                min={1}
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
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Uploading...
                  </>
                ) : (
                  "Save photo"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ShowImage
        showImageViewer={showImageViewer}
        setShowImageViewer={setShowImageViewer}
        Info={{ name, photo }}
      />
    </>
  );
};

export default ProfilePhoto;
