import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CommentSkeleton = () => {
  return (
    <div className="space-y-2 my-4 px-2">
      <div className="relative flex items-start gap-2">
        {/* Avatar */}
        <Skeleton circle width={32} height={32} />

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-[#f0f2f5] px-3 py-2">
            {/* Name + username */}
            <Skeleton width={120} height={12} />
            <Skeleton width={160} height={10} className="mt-1" />

            {/* Image placeholder */}
            <div className="mt-2 w-[30%]">
              <Skeleton height={180} borderRadius={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
