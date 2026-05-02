import { Outlet } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import React from "react";
import { Helmet } from "react-helmet-async";
const HomeLayout = () => {
  return (
    <>
      <Helmet>
        <title>Home Feed | Route Posts</title>
      </Helmet>
      <Navbar />
      <Outlet />
    </>
  );
};

export default React.memo(HomeLayout);
