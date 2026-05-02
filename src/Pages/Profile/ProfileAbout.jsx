import { faMessage, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ProfileAbout = ({ email }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <h3 className="text-sm font-extrabold text-slate-800">About</h3>
    <div className="mt-3 space-y-2 text-sm text-slate-600">
      <p className="flex items-center gap-2">
        <FontAwesomeIcon icon={faMessage} />
        {email || "loading_email@example.com"}
      </p>
      <p className="flex items-center gap-2">
        <FontAwesomeIcon icon={faUsers} />
        Active on Route Posts
      </p>
    </div>
  </div>
);

export default React.memo(ProfileAbout);
