import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingSkeleton  = () => {
  return (
    <div className="bg-white shadow-xl rounded my-5 animate-pulse">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Skeleton circle width={44} height={44} />
        <div className="flex-1">
          <Skeleton width={`30%`} height={12} className="mb-1" />
          <Skeleton width={`50%`} height={10} />
        </div>
        <Skeleton width={20} height={20} circle />
      </div>

      {/* Text Content */}
      <div className="p-4">
        <Skeleton count={3} />
      </div>

      {/* Image */}
      <div className="max-h-155 overflow-hidden border-y border-slate-200">
        <Skeleton height={200} />
      </div>

      {/* Reactions */}
      <div className="p-4 flex justify-between items-center">
        <Skeleton width={100} height={20} />
        <Skeleton width={50} height={20} />
      </div>

      {/* Comments */}
      <div className="p-4">
        <Skeleton count={2} />
      </div>
    </div>
  );
};

export default LoadingSkeleton  ;