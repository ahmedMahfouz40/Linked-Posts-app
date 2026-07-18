import { Outlet } from "react-router-dom";
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../../Components/Navbar/Navbar";
const HomeLayout = () => {
  return (
    <div className="dark:bg-slate-950">
      <Helmet>
        <title>Home Feed | Route Posts</title>
      </Helmet>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default React.memo(HomeLayout);
