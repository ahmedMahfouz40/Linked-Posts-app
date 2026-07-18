import React from "react";

const ProfileStats = ({ followers, following, bookmarks }) => (
  <div className="grid w-full grid-cols-3 gap-2 lg:w-130">
    {[
      { label: "Followers", value: followers },
      { label: "Following", value: following },
      { label: "Bookmarks", value: bookmarks },
    ].map((stat) => (
      <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs dark:text-slate-400">{stat.label}</p>
        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl dark:text-white">{stat.value || 0}</p>
      </div>
    ))}
  </div>
);

export default React.memo(ProfileStats);