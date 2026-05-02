import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const NoComments = () => {
  return (
    <div>
      <div className="space-y-2">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3ff] text-[#1877f2]">
            <FontAwesomeIcon icon={faMessage} />
          </div>
          <p className="text-lg font-extrabold text-slate-800">
            No comments yet
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Be the first to comment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoComments);
