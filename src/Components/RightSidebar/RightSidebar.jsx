import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGet from "../../CustomHooks/useGetPosts";
import SuggestionPerson from "./SuggestionPerson";
import { faMagnifyingGlass, faUsers } from "@fortawesome/free-solid-svg-icons";

import SuggestionPersonSkeleton from "../LoadingSkeleton/SuggestionPersonSkeleton";
import useToggleFollow from "../../CustomHooks/useToggleFollow";
const RightSidebar = () => {
  // ? Get Follow Suggestions
  const { data, isLoading } = useGet(
    ["followSuggestions"],
    `users/suggestions?limit=10`,
    Boolean(localStorage.getItem("token")),
  );
  const suggestions = data?.data?.data?.suggestions;

  // ? Toggle Follow
  const { mutate: mutateFollow, isPending } = useToggleFollow();

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-[#1877f2] dark:text-[#63b3ff]" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Suggested Friends
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {suggestions?.length}
          </span>
        </div>
        <div className="mb-3">
          <label className="relative block">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              placeholder="Search friends..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
            ></input>
          </label>
        </div>
        {/* Suggested Friends  */}
        <div className="space-y-3">
          {/* suggested person to follow */}
          {isLoading ? (
            <>
              <SuggestionPersonSkeleton />
              <SuggestionPersonSkeleton />
              <SuggestionPersonSkeleton />
            </>
          ) : (
            <>
              {suggestions?.map((person) => (
                <SuggestionPerson
                  isPending={isPending}
                  mutateFollow={mutateFollow}
                  key={person._id}
                  suggested={person}
                />
              ))}
            </>
          )}
        </div>
        {/* button to view more suggestion following */}
        <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          View more
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;