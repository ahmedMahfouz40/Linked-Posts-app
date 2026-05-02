import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileHeaderSkeleton = () => {
  return (
    <div className="mb-3 flex items-start gap-3">
      {/* Avatar */}
      <Skeleton circle width={44} height={44} />

      {/* Name and Privacy */}
      <div className="flex-1">
        {/* Name */}
        <Skeleton width={`40%`} height={18} className="mb-1" />

        {/* Privacy selector */}
        <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1">
          <Skeleton width={20} height={20} circle /> {/* placeholder for icon */}
          <Skeleton width={80} height={16} /> {/* placeholder for select */}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;