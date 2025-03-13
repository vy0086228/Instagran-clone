import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.jsx";

const MainLayout = () => {
  return (
    <div>
      <LeftSidebar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
