import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import CreatePost from "../../Components/Posts/CreatePost";
const RightSidebar = lazy(() => import("../../Components/RightSidebar/RightSidebar"));
const LeftSidebar = lazy(() => import("../../Components/LeftSidebar/LeftSidebar"));
const FeedLayout = () => {
  return (
    <section className=" px-3 sm:px-5 md:px-10 xl:px-20 grid gap-3 dark:bg-slate-950 grid-cols-8 py-20">
      {/* Left Sidebar */}
      <aside className=" order-1 col-span-8 xl:col-span-2 h-fit space-y-3 xl:sticky xl:top-20 xl:block">
        <Suspense
          fallback={<div className="animate-pulse h-40 bg-gray-100 rounded dark:bg-slate-800" />}
        >
          <LeftSidebar />
        </Suspense>
      </aside>
      {/* Content */}
      <div className=" order-2 col-span-8 xl:col-span-4 ">
        <CreatePost />
        <Outlet />
      </div>
      {/* Right Sidebar */}
      <aside className="order-3 col-span-2 hidden h-fit xl:sticky xl:top-21 xl:block ">
        <Suspense
          fallback={<div className="animate-pulse h-40 bg-gray-100 rounded dark:bg-slate-800" />}
        >
          <RightSidebar />
        </Suspense>
      </aside>
    </section>
  );
};

export default FeedLayout;