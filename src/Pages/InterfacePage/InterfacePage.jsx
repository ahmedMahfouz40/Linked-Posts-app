import React from "react";
const InterfacePage = () => {
  return (
    <div>
      <section className=" w-full max-w-xl text-center lg:order-1 lg:text-left mx-auto">
        {/* Header */}
        <div>
          <h1 className="hidden lg:block text-5xl font-extrabold tracking-tight text-[#00298d] sm:text-6xl dark:text-[#8fa8ff]">
            Lucky Posts
          </h1>
          <p className="hidden lg:block mt-4 text-2xl font-medium leading-snug text-slate-800 dark:text-slate-300">
            Connect with friends and the world around you on Lucky Posts.
          </p>
        </div>
        {/* About Lucky Posts */}
        <div className="mt-6 rounded-2xl border border-[#c9d5ff] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5 dark:border-[#2a3562] dark:bg-slate-900/80">
          <div className="py-2">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d] dark:text-[#8fa8ff]">
              About Lucky Posts
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              A Social Space Built to Bring People Closer
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Lucky Posts is a place to share moments, follow the people who
              matter to you, and stay connected wherever you are. Post
              updates, browse your feed, and build real conversations with
              friends, family, and communities that share your interests. We
              focus on making every interaction simple, fast, and meaningful.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3  ">
            <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2 dark:border-[#2a3562] dark:bg-[#141a35]">
              <p className="text-base font-extrabold text-[#00298d] dark:text-[#8fa8ff]">2026</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Launched
              </p>
            </div>
            <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2 dark:border-[#2a3562] dark:bg-[#141a35]">
              <p className="text-base font-extrabold text-[#00298d] dark:text-[#8fa8ff]">10K+</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Active Users
              </p>
            </div>
            <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2 dark:border-[#2a3562] dark:bg-[#141a35]">
              <p className="text-base font-extrabold text-[#00298d] dark:text-[#8fa8ff]">50K+</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Posts Shared
              </p>
            </div>
            <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2 dark:border-[#2a3562] dark:bg-[#141a35]">
              <p className="text-base font-extrabold text-[#00298d] dark:text-[#8fa8ff]">24/7</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Always Online
              </p>
            </div>
            <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2 dark:border-[#2a3562] dark:bg-[#141a35]">
              <p className="text-base font-extrabold text-[#00298d] dark:text-[#8fa8ff]">100%</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Free to Join
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InterfacePage;