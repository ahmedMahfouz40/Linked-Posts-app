import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  faBookmark,
  faEarth,
  faNewspaper,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
const LeftSidebar = () => {
  return (
    <div>
      <div className=" sm:grid  grid-cols-2 gap-4  xl:block           rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <NavLink
          to={"/feed/myFeed"}
          className="flex w-full items-center border xl:border-0 border-blue-200 gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faNewspaper} />
          Feed
        </NavLink>
        <NavLink
          to={"/feed/myPosts"}
          className="mt-1 flex w-full items-center border xl:border-0 border-blue-200 gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faWandSparkles} />
          My Posts
        </NavLink>
        <NavLink
          to={"/feed/community"}
          className="mt-1 flex w-full items-center border xl:border-0 border-blue-200 gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faEarth} />
          Community
        </NavLink>
        <NavLink
          to={"/feed/saved"}
          className="mt-1 flex w-full items-center border xl:border-0 border-blue-200 gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faBookmark} />
          Saved
        </NavLink>
      </div>
    </div>
  );
};

export default LeftSidebar;
