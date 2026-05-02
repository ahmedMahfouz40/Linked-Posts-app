import React from "react";

const ProfileCover = () => (
  <div className="group/cover relative  h-44 sm:h-52 lg:h-60 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]"></div>
    <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl"></div>
    <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl"></div>
    <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent"></div>
    <label className="absolute right-2 top-2 z-10 flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/45 px-2 py-1 mt-20 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:px-3 sm:py-1.5 sm:text-xs">
      Add cover
      <input type="file" accept="image/*" className="hidden" />
    </label>
  </div>
);

export default React.memo(ProfileCover);
