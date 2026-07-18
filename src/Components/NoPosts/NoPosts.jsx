import React from "react";

const NoPosts = () => {
  return (
    <div className="my-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No posts yet. Be the first one to publish.
      </div>
    </div>
  );
};

export default NoPosts;