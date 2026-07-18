import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const DeleteModal = ({ modalId, onConfirm }) => {
  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />

      <div className="modal" role="dialog">
        <div className="modal-box dark:bg-slate-900">
          <h2 className="font-bold text-xl border-b border-gray-400 dark:text-white dark:border-slate-700">
            Confirm action
          </h2>
          <div className="flex items-start gap-3 p-4">
            <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Delete this post?
              </h5>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                This post will be permanently removed from your profile and
                feed.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {/* Cancel */}
            <label htmlFor={modalId} className="btn">
              Cancel
            </label>

            {/* Confirm delete */}
            <label
              htmlFor={modalId}
              className="btn  text-white bg-red-700"
              onClick={onConfirm}
            >
              Delete Post
            </label>
          </div>
        </div>

        <label className="modal-backdrop" htmlFor={modalId}>
          Close
        </label>
      </div>
    </>
  );
};

export default React.memo(DeleteModal);
