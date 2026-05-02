import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const NotificationItemSkeleton = () => {
  return (
    <>
    <div className="my-5">
      <article className="group relative flex gap-3 rounded-xl border p-3 sm:rounded-2xl sm:p-4 border-[#dbeafe] bg-[#edf4ff] animate-pulse">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Skeleton circle={true} height={44} width={44} />
          <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
            <Skeleton circle={true} height={20} width={20} />
          </span>
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
            <p className="text-sm leading-6 text-slate-800 flex flex-wrap gap-1">
              <Skeleton width={80} height={16} /> {/* Actor Name */}
              <Skeleton width={120} height={16} /> {/* Notification text */}
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Skeleton width={40} height={12} /> {/* Time */}
              <Skeleton circle={true} height={8} width={8} /> {/* Dot */}
            </div>
          </div>

          <p className="mt-0.5 text-sm text-slate-600">
            <Skeleton width="90%" height={14} />
          </p>

          <div className="mt-2 flex items-center gap-2">
            <Skeleton width={90} height={28} borderRadius={6} />
          </div>
        </div>
      </article>
    </div>
    <div className="my-5">
      <article className="group relative flex gap-3 rounded-xl border p-3 sm:rounded-2xl sm:p-4 border-[#dbeafe] bg-[#edf4ff] animate-pulse">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Skeleton circle={true} height={44} width={44} />
          <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
            <Skeleton circle={true} height={20} width={20} />
          </span>
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
            <p className="text-sm leading-6 text-slate-800 flex flex-wrap gap-1">
              <Skeleton width={80} height={16} /> {/* Actor Name */}
              <Skeleton width={120} height={16} /> {/* Notification text */}
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Skeleton width={40} height={12} /> {/* Time */}
              <Skeleton circle={true} height={8} width={8} /> {/* Dot */}
            </div>
          </div>

          <p className="mt-0.5 text-sm text-slate-600">
            <Skeleton width="90%" height={14} />
          </p>

          <div className="mt-2 flex items-center gap-2">
            <Skeleton width={90} height={28} borderRadius={6} />
          </div>
        </div>
      </article>
    </div>
    <div className="my-5">
      <article className="group relative flex gap-3 rounded-xl border p-3 sm:rounded-2xl sm:p-4 border-[#dbeafe] bg-[#edf4ff] animate-pulse">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Skeleton circle={true} height={44} width={44} />
          <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
            <Skeleton circle={true} height={20} width={20} />
          </span>
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
            <p className="text-sm leading-6 text-slate-800 flex flex-wrap gap-1">
              <Skeleton width={80} height={16} /> {/* Actor Name */}
              <Skeleton width={120} height={16} /> {/* Notification text */}
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Skeleton width={40} height={12} /> {/* Time */}
              <Skeleton circle={true} height={8} width={8} /> {/* Dot */}
            </div>
          </div>

          <p className="mt-0.5 text-sm text-slate-600">
            <Skeleton width="90%" height={14} />
          </p>

          <div className="mt-2 flex items-center gap-2">
            <Skeleton width={90} height={28} borderRadius={6} />
          </div>
        </div>
      </article>
    </div>
    </>
  );
};

export default NotificationItemSkeleton;