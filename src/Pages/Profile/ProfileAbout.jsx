import { faMessage, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ProfileAbout = ({ email }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">About</h3>
    <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
      <p className="flex items-center gap-2">
        <FontAwesomeIcon icon={faMessage} />
        {email || "loading_email@example.com"}
      </p>
      <p className="flex items-center gap-2">
        <FontAwesomeIcon icon={faUsers} />
        Active on Lucky Posts
      </p>
    </div>
  </div>
);

export default React.memo(ProfileAbout);