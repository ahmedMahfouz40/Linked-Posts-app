import { useCallback } from "react";
import { faBookmark, faFileText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const PostsToggle = ({ setToggle, toggleHeader, savedCount, postsCount }) => {
  const handleMyPosts = useCallback(() => setToggle("myPosts"), [setToggle]);
  const handleSaved = useCallback(() => setToggle("saved"), [setToggle]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0 dark:bg-slate-900">
        <button
          onClick={handleMyPosts}
          className={`inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition
            ${toggleHeader === "myPosts"
              ? "bg-white text-[#1877f2] shadow-sm dark:bg-slate-700 dark:text-[#63b3ff]"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
        >
          <FontAwesomeIcon icon={faFileText} />
          My Posts
        </button>
        <button
          onClick={handleSaved}
          className={`inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition
            ${toggleHeader === "saved"
              ? "bg-white text-[#1877f2] shadow-sm dark:bg-slate-700 dark:text-[#63b3ff]"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
        >
          <FontAwesomeIcon icon={faBookmark} />
          Saved
        </button>
      </div>
      <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2] dark:bg-slate-900 dark:text-[#63b3ff]">
        {toggleHeader === "myPosts" ? postsCount : savedCount}
      </span>
    </div>
  );
};

export default React.memo(PostsToggle);