import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPen,
  faTrash,
  faImage,
  faPaperPlane,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";
import AuthContext from "../../AuthContext/authContext";
import headerObject from "../../utils/headerObject";
import timeAgoShort from "../../utils/timeAgo";
import useGet from "../../CustomHooks/useGetPosts";

// ─ API functions (outside component — stable, no recreation)

function deleteComment(postId, commentId) {
  return axios.delete(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    headerObject(),
  );
}

function updateComment(postId, commentId, values) {
  const formData = new FormData();
  if (values?.content) formData.append("content", values.content);
  if (values?.image?.[0]) formData.append("image", values.image[0]);
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    formData,
    headerObject(),
  );
}

function createReply(postId, commentId, values) {
  const formData = new FormData();
  if (values?.content) formData.append("content", values.content);
  if (values?.image?.[0]) formData.append("image", values.image[0]);
  return axios.post(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
    formData,
    headerObject(),
  );
}

//  Component

const AllComments = ({ post, comment, likeCommentFn, isPending }) => {
  const { profileData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  //  Destructure vlues
  const { content, createdAt, image } = comment || {};
  const { name, photo } = comment?.commentCreator || {};
  const commentCreatorId = comment?.commentCreator?._id;
  const profileUserId = profileData?._id;
  const commentContent = comment?.content;

  //  Memoized values
  const storageLikeKey = useMemo(
    () => `liked_comment_${comment._id}`,
    [comment._id],
  );

  const isCommentLiked = useMemo(
    () =>
      JSON.parse(localStorage.getItem(storageLikeKey)) ??
      comment.isLiked ??
      false,
    [storageLikeKey, comment.isLiked],
  );

  //  UI state
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [clickUpdate, setClickUpdate] = useState(false);
  const [replyPreview, setReplyPreview] = useState(null);

  //  Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Delete comment
  const { mutate: deleteFn, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteComment(post._id, comment._id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setIsOpen(false);
      queryClient.invalidateQueries(["postComments", post._id]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to delete comment"),
  });

  //  Update comment
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { content: "", image: null },
  });

  const { mutate: updateCommentFn } = useMutation({
    mutationFn: (values) => updateComment(post._id, comment._id, values),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["postComments", post._id]);
      setClickUpdate(false);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to update comment"),
  });

  //  Replies
  const {
    data: repliesData,
    isFetching,
    refetch: refetchReplies,
  } = useGet(
    ["commentReplies", comment._id],
    `posts/${comment.post}/comments/${comment._id}/replies?page=1&limit=10`,
    showReplies,
  );
  const commentReplies = repliesData?.data?.data?.replies;

  //  Reply form
  const {
    register: registerReply,
    handleSubmit: handleReplySubmit,
    reset: resetReply,
    getValues: getReplyValues,
  } = useForm({ defaultValues: { content: "", image: null } });

  const handleReplyImageChange = useCallback((e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setReplyPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
  }, []);

  const handleRemoveReplyImage = useCallback(() => {
    setReplyPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    resetReply({ content: getReplyValues("content"), image: null });
  }, [getReplyValues, resetReply]);

  //  Create reply
  const { mutate: createReplyFn, isPending: isReplying } = useMutation({
    mutationFn: (values) => createReply(post._id, comment._id, values),
    onSuccess: async (res) => {
      toast.success(res.data.message);
      if (replyPreview) URL.revokeObjectURL(replyPreview);
      setReplyPreview(null);
      resetReply();
      setShowReplies(true);

      await queryClient.invalidateQueries(["commentReplies", comment._id]);
      refetchReplies();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to create reply"),
  });

  //  Stable callbacks
  const handleLike = useCallback(
    () => likeCommentFn(comment._id),
    [likeCommentFn, comment._id],
  );

  const handleToggleReplyForm = useCallback(
    () => setShowReplyForm((prev) => !prev),
    [],
  );

  const handleToggleReplies = useCallback(
    () => setShowReplies((prev) => !prev),
    [],
  );

  const handleToggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleEditClick = useCallback(() => {
    setClickUpdate(true);
    setValue("content", commentContent);
    setIsOpen(false);
  }, [setValue, commentContent, setClickUpdate, setIsOpen]);

  return (
    <div className="space-y-2 my-4 px-2 flex justify-between relative">
      <div className="relative flex items-start gap-2 w-full">
        {/* Avatar */}
        <img
          src={photo}
          className="mt-0.5 h-8 w-8 rounded-full object-cover shrink-0"
          alt={name}
        />

        <div className="min-w-0 flex-1">
          {/* Comment bubble */}
          <div className="relative inline-block max-w-full rounded-2xl bg-[#f0f2f5] px-3 py-2">
            <p className="text-xs font-bold text-slate-900">{name}</p>

            {clickUpdate ? (
              <form
                onSubmit={handleSubmit(updateCommentFn)}
                className="mt-2 flex items-center gap-2"
              >
                <input
                  {...register("content")}
                  className="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setClickUpdate(false)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                  {content}
                </p>
                {image && (
                  <img
                    src={image}
                    className="mt-2 max-h-52 w-full rounded-lg object-cover"
                    alt="comment"
                  />
                )}
              </div>
            )}
          </div>

          {/* Actions row */}
          <div className="mt-1.5 flex items-center gap-4 px-1">
            <span className="text-xs font-semibold text-slate-400">
              {timeAgoShort(createdAt)}
            </span>

            <button
              disabled={isPending}
              onClick={handleLike}
              className={`text-xs font-semibold cursor-pointer hover:underline disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                ${isCommentLiked ? "text-[#1877f2]" : "text-slate-500"}`}
            >
              Like ({comment.likes.length})
            </button>

            <button
              type="button"
              onClick={handleToggleReplyForm}
              className="text-xs cursor-pointer font-semibold transition hover:underline text-slate-500 hover:text-[#1877f2]"
            >
              Reply ({comment.repliesCount})
            </button>

            {comment.repliesCount > 0 && (
              <button
                type="button"
                onClick={handleToggleReplies}
                className="text-xs cursor-pointer font-semibold transition hover:underline text-[#1877f2]"
              >
                {showReplies ? "Hide replies" : "View replies"}
              </button>
            )}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-2 ml-2">
              <div className="flex items-start gap-2">
                <img
                  src={profileData?.photo}
                  alt={profileData?.name}
                  className="h-7 w-7 rounded-full object-cover mt-1 shrink-0"
                />
                <div className="flex-1 rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white transition">
                  <form onSubmit={handleReplySubmit(createReplyFn)}>
                    <textarea
                      {...registerReply("content")}
                      placeholder={`Reply as ${profileData?.name}...`}
                      rows={1}
                      className="max-h-28 min-h-8 w-full resize-none bg-transparent px-2 py-1 text-sm leading-5 outline-none placeholder:text-slate-500"
                    />

                    {replyPreview && (
                      <div className="relative mx-2 mb-2">
                        <img
                          src={replyPreview}
                          alt="preview"
                          className="max-h-40 w-full rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveReplyImage}
                          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                        >
                          <FontAwesomeIcon icon={faTimes} className="text-xs" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-1">
                      <label
                        htmlFor={`reply-image-${comment._id}`}
                        className="inline-flex cursor-pointer items-center justify-center rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600"
                      >
                        <FontAwesomeIcon icon={faImage} className="text-sm" />
                        <input
                          {...registerReply("image")}
                          type="file"
                          accept="image/*"
                          id={`reply-image-${comment._id}`}
                          className="hidden"
                          onChange={(e) => {
                            registerReply("image").onChange(e);
                            handleReplyImageChange(e);
                          }}
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={isReplying}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1877f2] text-white transition hover:bg-[#166fe5] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon
                          icon={isReplying ? faSpinner : faPaperPlane}
                          spin={isReplying}
                          className="text-xs"
                        />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Replies list */}
          {showReplies && (
            <div className="mt-2 ml-8 space-y-2">
              {isFetching ? (
                <p className="text-xs text-slate-400">Loading replies...</p>
              ) : commentReplies?.length > 0 ? (
                commentReplies.map((reply) => (
                  <div key={reply._id} className="flex items-start gap-2">
                    <img
                      src={reply.commentCreator?.photo}
                      alt={reply.commentCreator?.name}
                      className="h-7 w-7 rounded-full object-cover shrink-0"
                    />
                    <div className="rounded-2xl bg-[#f0f2f5] px-3 py-2">
                      <p className="text-xs font-bold text-slate-900">
                        {reply.commentCreator?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        @{reply.commentCreator?.username} ·{" "}
                        {timeAgoShort(reply.createdAt)}
                      </p>
                      <p className="mt-1 text-sm text-slate-800">
                        {reply.content}
                      </p>
                      {reply.image && (
                        <img
                          src={reply.image}
                          alt="reply"
                          className="mt-2 max-h-40 w-full rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No replies yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit / Delete menu — only for comment owner */}
      {commentCreatorId === profileUserId && (
        <div ref={menuRef}>
          <span onClick={handleToggleMenu} className="cursor-pointer">
            <FontAwesomeIcon icon={faEllipsis} className="text-gray-600" />
          </span>
          <div
            className={`absolute end-10 bg-white shadow rounded-xl border border-gray-300 flex flex-col gap-2 text-sm z-10 ${!isOpen && "hidden"}`}
          >
            <button
              type="button"
              onClick={handleEditClick}
              className="text-gray-600 cursor-pointer w-full text-start hover:bg-gray-200 py-2 px-3 rounded"
            >
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
            <button
              type="button"
              onClick={deleteFn}
              disabled={isDeleting}
              className="text-red-600 cursor-pointer hover:bg-red-100 py-2 px-3 rounded disabled:opacity-60"
            >
              <FontAwesomeIcon
                icon={isDeleting ? faSpinner : faTrash}
                spin={isDeleting}
              />{" "}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AllComments);
