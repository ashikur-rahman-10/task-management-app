import React from "react";
import NavigationBar from "../Components/NavigationBar/NavigationBar";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 to-pink-100 ">
      <div className="fixed z-30 top-0 w-full ">
        <NavigationBar></NavigationBar>
      </div>
      <div className="md:pt-16 max-w-6xl mx-auto  min-h-screen">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Main;
