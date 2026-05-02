import React from "react";

const ProfilePostsSummary = ({ posts, bookmarks }) => {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
            My posts
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900">
            {posts?.length || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
            Saved posts
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900">
            {bookmarks?.length || 0}
          </p>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProfilePostsSummary);
