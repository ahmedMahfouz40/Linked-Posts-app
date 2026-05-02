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

function sharePost(postId) {
  return axios.post(
    `https://route-posts.routemisr.com/posts/${postId}/share`,
    {},
    headerObject(),
  );
}

const PostReactions = ({ post, isDetails, setClickComment }) => {
  const queryClient = useQueryClient();
  const [showLikes, setShowLikes] = useState(false);

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

  const { mutate: sharePostFn, isPending: isSharing } = useMutation({
    mutationFn: () => sharePost(post._id),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries(["posts"]);
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
    <div>
      {/* Stats Section */}
      <div className="px-4 pb-2 pt-3 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
              <FontAwesomeIcon icon={faThumbsUp} size="xs" />
            </span>
            <button
              onClick={handleToggleLikes}
              className="font-semibold transition cursor-pointer hover:text-[#1877f2] hover:underline"
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
                className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
              >
                View details
              </Link>
            )}
          </div>
        </div>
      </div>

      <hr className="mx-4 border-slate-200" />

      {/* Likes List */}
      {showLikes && (
        <div className="mx-4 my-2">
          {likes.length === 0 ? (
            <p className="text-xs text-slate-400">No likes yet.</p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                {likes.length} likes
              </p>
              <div className="flex flex-col gap-1.5">
                {likes.map((like) => (
                  <Link
                    key={like._id}
                    to={`/profile/${like._id}`}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-white px-2.5 py-2 transition hover:bg-slate-50"
                  >
                    {like.photo ? (
                      <img
                        src={like.photo}
                        alt={like.name}
                        className="h-9 w-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-blue-800">
                          {like.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {like.name}
                      </p>
                      <p className="text-xs text-slate-500">@{like.username}</p>
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
            ${isLikedByUser ? "bg-blue-100 text-blue-600" : "text-slate-600 hover:bg-slate-100"}`}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>{isPending ? "Liking..." : "Like"}</span>
        </button>

        <button
          onClick={handleToggleComment}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:text-sm"
        >
          <FontAwesomeIcon icon={faComment} />
          <span>Comment</span>
        </button>

        <button
          disabled={isSharing}
          onClick={sharePostFn}
          className="disabled:cursor-not-allowed flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:text-sm"
        >
          <FontAwesomeIcon icon={faShareNodes} />
          <span>{isSharing ? "Sharing..." : "Share"}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PostReactions);
