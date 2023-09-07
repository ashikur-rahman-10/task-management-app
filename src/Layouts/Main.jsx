import React from "react";
import NavigationBar from "../Components/NavigationBar/NavigationBar";
import { Outlet } from "react-router-dom";

const Main = () => {
    return (
        <div className="w-full min-h-screen ">
            <div className="fixed z-30 top-0 w-full ">
                <NavigationBar></NavigationBar>
            </div>
            <div className="pt-8 max-w-6xl mx-auto">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Main;
