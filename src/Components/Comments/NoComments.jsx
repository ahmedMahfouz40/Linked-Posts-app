import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const NoComments = () => {
  return (
    <div>
      <div className="space-y-2">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3ff] text-[#1877f2] dark:bg-slate-800 dark:text-[#63b3ff]">
            <FontAwesomeIcon icon={faMessage} />
          </div>
          <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
            No comments yet
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Be the first to comment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoComments);