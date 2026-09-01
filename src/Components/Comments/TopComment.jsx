import React, { useContext } from "react";
import timeAgoShort from "../../utils/timeAgo";
import { Link } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext/authContext";

const TopComment = ({ comment, clickComment, setClickComment }) => {
  const { content, createdAt } = comment;
  const { name, photo, username, _id } = comment.commentCreator;
  const { profileData } = useContext(AuthContext);
  const profileLink = profileData._id === _id ? "/profile" : `/profile/${_id}`;
  return (
    <>
      <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Top Comment
        </p>
        <div className="flex items-start gap-2">
          <Link to={profileLink}>
            <img
              src={photo}
              alt="creator"
              className="h-8 w-8 rounded-full object-cover"
            />
          </Link>
          <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2 dark:bg-slate-900">
            <Link
              to={profileLink}
              className="truncate text-xs font-bold text-slate-900 hover:underline dark:text-slate-100"
            >
              {name}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{username} · {timeAgoShort(createdAt)}
            </p>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
              {content}
            </p>
          </div>
        </div>

        <button
          onClick={() => setClickComment(!clickComment)}
          className="mt-2 text-xs font-bold cursor-pointer text-[#1877f2] hover:underline dark:text-[#63b3ff]"
        >
          View all comments
        </button>
      </div>
    </>
  );
};

export default React.memo(TopComment);
