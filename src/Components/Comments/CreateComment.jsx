import React, { useCallback, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPaperPlane,
  faSmile,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import headerObject from "../../utils/headerObject";
import AuthContext from "../../Contexts/AuthContext/authContext";

function createComment(postId, values) {
  const formData = new FormData();
  if (values.content) formData.append("content", values.content);
  if (values.image?.[0]) formData.append("image", values.image[0]);

  return axios.post(
    `https://route-posts.routemisr.com/posts/${postId}/comments`,
    formData,
    headerObject(),
  );
}

const CreateComment = ({ post }) => {
  const [preview, setPreview] = useState(null);
  const { profileData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { content: "", image: null },
  });

  const { mutate: createCommentFn, isPending } = useMutation({
    mutationFn: (values) => createComment(post._id, values),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries( ["postComments", post._id] );
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      reset();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to add comment"),
  });

  const handleImageChange = useCallback((e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
  }, []);

  const handleRemovePreview = useCallback(() => {
    URL.revokeObjectURL(preview);
    setPreview(null);
  }, [preview]);

  return (
    <div className="mt-3 px-2">
      <div className="flex items-start gap-2">
        <img
          src={profileData?.photo}
          alt={profileData?.name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-[#3454c7] dark:focus-within:bg-slate-900">
          <form onSubmit={handleSubmit(createCommentFn)}>
            <textarea
              {...register("content")}
              placeholder={`Comment as ${profileData?.name}`}
              rows={1}
              className="max-h-35 min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label
                  htmlFor="comment-image"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <FontAwesomeIcon icon={faImage} />
                  <input
                    {...register("image")}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      register("image").onChange(e);
                      handleImageChange(e);
                    }}
                    id="comment-image"
                  />
                </label>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <FontAwesomeIcon icon={faSmile} />
                </button>
              </div>
              <button
                disabled={isPending}
                type="submit"
                className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff] dark:bg-[#3454c7] dark:hover:bg-[#2843a8] dark:disabled:bg-[#2a3562]"
              >
                <FontAwesomeIcon
                  icon={isPending ? faSpinner : faPaperPlane}
                  spin={isPending}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
      {preview && (
        <div className="relative p-6">
          <img
            src={preview}
            alt="preview"
            className="w-full h-100 rounded-2xl"
          />
          <span
            onClick={handleRemovePreview}
            className="absolute top-0 hover:text-red-500 cursor-pointer transition-colors right-3 text-2xl dark:text-slate-300"
          >
            ✕
          </span>
        </div>
      )}
    </div>
  );
};

export default CreateComment;