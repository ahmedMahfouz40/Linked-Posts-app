import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SuggestionPersonSkeleton = () => {
  return (
    <div className="rounded-xl border border-slate-200 p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 px-1 py-1">
          
          {/* avatar */}
          <Skeleton circle width={40} height={40} />

          <div className="min-w-0">
            {/* name */}
            <Skeleton width={120} height={14} />

            {/* username */}
            <Skeleton width={90} height={12} />
          </div>
        </div>

        {/* follow button */}
        <Skeleton width={80} height={28} borderRadius={999} />
      </div>

      {/* followers + mutual */}
      <div className="mt-2 flex items-center gap-2">
        <Skeleton width={80} height={18} borderRadius={999} />
        <Skeleton width={70} height={18} borderRadius={999} />
      </div>
    </div>
  );
};

export default SuggestionPersonSkeleton;