import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faEarth,
  faEllipsis,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import headerObject from "../../utils/headerObject";
import timeAgoShort from "../../utils/timeAgo";
import AuthContext from "../../Contexts/AuthContext/authContext";

function updatePost(postId, values) {
  const formData = new FormData();
  if (values?.body) formData.append("body", values.body);
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}`,
    formData,
    headerObject(),
  );
}

function bookmarkPost(postId) {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
    null,
    headerObject(),
  );
}

const PostHeader = ({ post }) => {
  const { profileData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [updatePostForm, setUpdatePostForm] = useState(false);
  const [showListPost, setShowListPost] = useState(false);
  const menuRef = useRef(null);

  const { body: postText, createdAt: postDate, privacy, id: postId } = post;
  const { name, photo: userImage } = post?.user || {};
  const modalId = `delete_modal_${postId}`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowListPost(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { body: "", image: null },
  });

  const { mutate: updatePostFn } = useMutation({
    mutationFn: (values) => updatePost(postId, values),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["postDetails", postId]);
      setUpdatePostForm(false);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to update post"),
  });

  const { mutate: bookmarkFn, isPending: isBookmarkPending } = useMutation({
    mutationFn: () => bookmarkPost(postId),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["bookmarks"]);
      toast.success(res?.data?.message);
      setShowListPost(false);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to bookmark post"),
  });

  return (
    <div className="postHeader rounded-t-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.user._id}`}>
            <img
              src={userImage}
              className="h-11 w-11 rounded-full object-cover"
              alt={name}
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              className="font-extrabold text-foreground hover:underline text-sm dark:text-white"
              to={`/profile/${post?.user._id}`}
            >
              {name}
            </Link>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground dark:text-slate-400">
              <button
                type="button"
                className="rounded px-0.5 py-0.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                {timeAgoShort(postDate)}
              </button>
              <span className="mx-1">·</span>
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faEarth} />
                {privacy}
              </span>
            </div>
          </div>

          <div ref={menuRef} className="relative z-50">
            <button
              onClick={() => setShowListPost((prev) => !prev)}
              className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <div
              className={`absolute ${!showListPost && "hidden"} right-5 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-950/40`}
            >
              <button
                onClick={bookmarkFn}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {isBookmarkPending ? (
                  post.bookmarked ? (
                    "Unsaving..."
                  ) : (
                    "Saving..."
                  )
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBookmark} />
                    {post.bookmarked ? "Unsave" : "Save"}
                  </>
                )}
              </button>
              {post?.user?._id === profileData?._id && (
                <>
                  <button
                    onClick={() => {
                      setUpdatePostForm(true);
                      setShowListPost(false);
                      setValue("body", postText);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    Edit post
                  </button>
                  <label
                    htmlFor={modalId}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete post
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          {!updatePostForm ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground dark:text-slate-200">
              {postText}
            </p>
          ) : (
            <div className="relative">
              <form onSubmit={handleSubmit(updatePostFn)}>
                <textarea
                  {...register("body")}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={() => setUpdatePostForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PostHeader);