import React, { useCallback, useContext, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmericas,
  faImage,
  faPaperPlane,
  faSmile,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getHeaderObject from "../../utils/headerObject";
import ProfileHeaderSkeleton from "../LoadingSkeleton/ProfileHeaderSkeleton";
import AuthContext from "../../Contexts/AuthContext/authContext";

function handleCreatePost(values) {
  const formData = new FormData();
  if (values?.body) formData.append("body", values.body);
  if (values?.image) formData.append("image", values.image[0]);

  return axios.post(
    "https://route-posts.routemisr.com/posts",
    formData,
    getHeaderObject(),
  );
}

const CreatePost = () => {
  const { profileData } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const previewRef = useRef(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { body: "", image: null, privacy: "public" },
  });

  const handleImageChange = useCallback((e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      const url = URL.createObjectURL(selected);
      previewRef.current = url;
      return url;
    });
  }, []);

  const handleRemoveImage = useCallback(() => {
    URL.revokeObjectURL(preview);
    previewRef.current = null;
    setPreview(null);
  }, [preview]);

  const { mutate, isPending } = useMutation({
    mutationFn: handleCreatePost,
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
      setPreview(null);
      reset();
      queryClient.invalidateQueries( ["posts"] );
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to create post"),
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {!profileData ? (
        <ProfileHeaderSkeleton />
      ) : (
        <div className="mb-3 flex items-start gap-3">
          <img
            src={profileData.photo}
            className="h-11 w-11 rounded-full object-cover"
            alt={profileData.name}
          />
          <div className="flex-1">
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {profileData.name}
            </p>
            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <FontAwesomeIcon icon={faEarthAmericas} />
              <select
                {...register("privacy")}
                className="bg-transparent outline-none"
              >
                <option value="public">Public</option>
                <option value="following">Followers</option>
                <option value="only_me">Only me</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(mutate)}>
        <textarea
          {...register("body")}
          rows="4"
          placeholder={`What's on your mind, ${profileData?.name}?`}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 dark:border-slate-700">
          <div className="relative flex items-center gap-2">
            <label
              htmlFor="postImage"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <FontAwesomeIcon icon={faImage} className="text-teal-500" />
              Photo/Video
            </label>
            <input
              {...register("image")}
              onChange={(e) => {
                register("image").onChange(e);
                handleImageChange(e);
              }}
              type="file"
              id="postImage"
              className="hidden"
            />
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <FontAwesomeIcon icon={faSmile} className="text-amber-500" />
              <span className="hidden sm:inline">Feeling/activity</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:opacity-60 dark:bg-[#3454c7] dark:hover:bg-[#2843a8]"
          >
            {isPending ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <>
                Send <FontAwesomeIcon icon={faPaperPlane} />
              </>
            )}
          </button>
        </div>

        {preview && (
          <div className="bg-white p-6 relative dark:bg-slate-900">
            <img
              src={preview}
              alt="preview"
              className="w-full h-100 object-cover rounded-2xl"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="cursor-pointer absolute top-2 right-2 hover:text-red-700 dark:text-slate-300 dark:hover:text-red-400"
            >
              ✕
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;