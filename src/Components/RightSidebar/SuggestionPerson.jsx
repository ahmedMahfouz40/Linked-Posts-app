import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const SuggestionPerson = ({ suggested, mutateFollow, isPending }) => {
  return (
    <>
      <div className="rounded-xl border border-slate-200 p-2 5">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/profile/${suggested?._id}`}
            type="button"
            className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50"
          >
            {suggested?.photo && (
              <img
                src={suggested?.photo}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 hover:underline">
                {suggested?.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                @{suggested?.username || "route user"}
              </p>
            </div>
          </Link>
          <button
            disabled={isPending}
            onClick={() => mutateFollow(suggested?._id)}
            className="inline-flex items-center cursor-pointer disabled:cursor-not-allowed gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 bg-[#e7f3ff] text-[#1877f2] hover:bg-[#d8ebff]"
          >
            <FontAwesomeIcon icon={faPlus} />
            <> {suggested?.following ? "UnFollow" : "Follow"}</>
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5">
            {suggested?.followersCount} followers
          </span>
          <span className="rounded-full bg-[#edf4ff] px-2 py-0.5 text-[#1877f2]">
            {suggested?.mutualFollowersCount} mutual
          </span>
        </div>
      </div>
    </>
  );
};

export default SuggestionPerson;
