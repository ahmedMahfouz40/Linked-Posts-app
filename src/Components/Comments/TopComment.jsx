import React from "react";
import timeAgoShort from "../../utils/timeAgo";
import { Link } from "react-router-dom";

const TopComment = ({ comment, clickComment, setClickComment }) => {
  const { content, createdAt } = comment;
  const { name, photo, username, _id } = comment.commentCreator;

  return (
    <>
      <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          Top Comment
        </p>
        <div className="flex items-start gap-2">
          <Link to={`/profile/${_id}`}>
            <img
              src={photo}
              alt="creator"
              className="h-8 w-8 rounded-full object-cover"
            />
          </Link>
          <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2">
            <Link
              to={`/profile/${_id}`}
              className="truncate text-xs font-bold text-slate-900 hover:underline"
            >
              {name}
            </Link>
            <p className="text-xs text-slate-500">
              @{username} · {timeAgoShort(createdAt)}
            </p>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">
              {content}
            </p>
          </div>
        </div>

        <button
          onClick={() => setClickComment(!clickComment)}
          className="mt-2 text-xs font-bold text-[#1877f2] hover:underline"
        >
          View all comments
        </button>
      </div>
    </>
  );
};

export default React.memo(TopComment);
