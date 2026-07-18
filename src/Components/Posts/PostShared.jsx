import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import PostImage from "./PostImage";

const PostShared = ({ post }) => {
  const { body, image, user, id } = post?.sharedPost || {};
  
  if (!post) return null;
  return (
    <div className="mx-4 my-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2">
          {user?.photo && (
            <img
              src={user?.photo}
              alt={user?.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">@{user?.username}</p>
          </div>
          <Link
            to={`/postDetails/${id}`}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff] dark:text-[#63b3ff] dark:hover:bg-slate-700"
          >
            Original Post
            <FontAwesomeIcon icon={faExternalLink} />
          </Link>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          {body}
        </p>
      </div>
      <PostImage postImage={image} />
    </div>
  );
};

export default React.memo(PostShared);