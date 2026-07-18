import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faShareNodes,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import useGet from "../../CustomHooks/useGetPosts";
import headerObject from "../../utils/headerObject";

function toggleLike(postId) {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/like`,
    null,
    headerObject(),
  );
}

//  updated to accept optional body
function sharePost(postId, body) {
  return axios.post(
    `https://route-posts.routemisr.com/posts/${postId}/share`,
    { body },
    headerObject(),
  );
}

const PostReactions = ({ post, isDetails, setClickComment }) => {
  const queryClient = useQueryClient();
  const [showLikes, setShowLikes] = useState(false);

  //  new state for share UI
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareBody, setShareBody] = useState("");

  const storageLikeKey = useMemo(() => `liked_${post._id}`, [post._id]);

  const { data: dataLikes } = useGet(
    ["postLike", post._id],
    `posts/${post._id}/likes?page=1&limit=20`,
    Boolean(post._id),
  );
  const likes = dataLikes?.data?.data?.likes || [];

  const {
    mutate,
    isPending,
    data: toggleLikeData,
  } = useMutation({
    mutationFn: () => toggleLike(post._id),
    onSuccess: (res) => {
      localStorage.setItem(storageLikeKey, JSON.stringify(res.data.data.liked));
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["postDetails", post._id]);
      queryClient.invalidateQueries(["postLike", post._id]);
      toast.success(res.data.message);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to like this post"),
  });

  //  updated mutation to use shareBody
  const { mutate: sharePostFn, isPending: isSharing } = useMutation({
    mutationFn: () => sharePost(post._id, shareBody.trim() || undefined),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries(["posts"]);
      setIsShareOpen(false);
      setShareBody("");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? "Failed to share post"),
  });

  const isLikedByUser = useMemo(
    () =>
      toggleLikeData?.data?.data?.liked ??
      JSON.parse(localStorage.getItem(storageLikeKey)) ??
      false,
    [toggleLikeData, storageLikeKey],
  );

  const handleLike = useCallback(() => mutate(), [mutate]);
  const handleToggleLikes = useCallback(
    () => setShowLikes((prev) => !prev),
    [],
  );
  const handleToggleComment = useCallback(
    () => setClickComment((prev) => !prev),
    [setClickComment],
  );

  return (
    <div className="pb-2">
      {/* Stats Section */}
      <div className="px-4 pb-2 pt-3 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white dark:bg-[#3454c7]">
              <FontAwesomeIcon icon={faThumbsUp} size="xs" />
            </span>
            <button
              onClick={handleToggleLikes}
              className="font-semibold transition cursor-pointer hover:text-[#1877f2] hover:underline dark:hover:text-[#63b3ff]"
            >
              {post?.likesCount} likes
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <span>{post.sharesCount} shares</span>
            <span>{post.commentsCount} comments</span>
            {!isDetails && (
              <Link
                to={`/PostDetails/${post._id}`}
                className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff] dark:text-[#63b3ff] dark:hover:bg-slate-800"
              >
                View details
              </Link>
            )}
          </div>
        </div>
      </div>

      <hr className="mx-4 border-slate-200 dark:border-slate-700" />

      {/* Likes List */}
      {showLikes && (
        <div className="mx-4 my-2">
          {likes.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">No likes yet.</p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2 dark:text-slate-500">
                {likes.length} likes
              </p>
              <div className="flex flex-col gap-1.5">
                {likes.map((like) => (
                  <Link
                    key={like._id}
                    to={`/profile/${like._id}`}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-white px-2.5 py-2 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    {like.photo ? (
                      <img
                        src={like.photo}
                        alt={like.name}
                        className="h-9 w-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 dark:bg-blue-950/40">
                        <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                          {like.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate dark:text-slate-100">
                        {like.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">@{like.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Reaction Buttons */}
      <div className="grid grid-cols-3 gap-1 p-1">
        <button
          disabled={isPending}
          onClick={handleLike}
          className={`disabled:cursor-not-allowed flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-semibold transition-colors sm:text-sm
            ${isLikedByUser ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>{isPending ? "Liking..." : "Like"}</span>
        </button>
        <button
          onClick={handleToggleComment}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:text-sm dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <FontAwesomeIcon icon={faComment} />
          <span>Comment</span>
        </button>

        {/*  updated Share button */}
        <button
          disabled={isSharing}
          onClick={() => {
            setIsShareOpen((prev) => !prev);
            if (!isShareOpen) setShareBody("");
          }}
          className="disabled:cursor-not-allowed flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:text-sm dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <FontAwesomeIcon icon={faShareNodes} />
          <span>{isSharing ? "Sharing..." : "Share"}</span>
        </button>
      </div>

      {isShareOpen && (
        <div className="mx-4 my-2 p-3 border border-gray-200 rounded-lg bg-white dark:border-slate-700 dark:bg-slate-800">
          <textarea
            placeholder="Write something (optional)..."
            value={shareBody}
            onChange={(e) => setShareBody(e.target.value)}
            className="w-full  p-2 rounded text-sm outline-none resize-none dark:bg-slate-800 dark:text-slate-100"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setIsShareOpen(false);
                setShareBody("");
              }}
              className="px-3 py-1 text-sm  cursor-pointer rounded bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              Cancel
            </button>

            <button
              disabled={isSharing}
              onClick={sharePostFn}
              className="px-3 py-1 text-sm cursor-pointer  rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-[#3454c7] dark:hover:bg-[#2843a8]"
            >
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PostReactions);