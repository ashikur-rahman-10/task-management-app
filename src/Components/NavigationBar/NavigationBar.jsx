import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CustomLoader from "../customLoader/CustomLoader";
import useAuth from "../../Hooks/UseAuth";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => navigate("/"))
      .catch(() => {});
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="bg-gradient-to-r from-[#f6abe8] via-[#ec6dd5] to-[#7e8af4] text-white border-b border-purple-600 w-full bg-opacity-25">
      <div className="navbar max-w-6xl mx-auto flex justify-between items-center">
        {/* Empty left side for balance */}
        <div className="flex-1"></div>

        {/* Centered logo */}
        <div className="flex-1 flex justify-center">
          <Link
            to="/"
            className="hover:scale-105 duration-500 rounded-xl px-4 py-2 text-sm md:text-2xl font-medium"
          >
            Today's Ahead
          </Link>
        </div>

        {/* Right side: Theme toggle, logout, profile/login */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          {/* Logout or Login */}
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium text-sm md:text-base border px-2 py-1 rounded-lg hover:border-gray-600"
              >
                Logout
              </button>
              <Link to="/profile" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 h-10 rounded-full outline outline-success">
                  {user.photoURL ? (
                    <img
                      className="rounded-full"
                      src={user.photoURL}
                      alt="Profile"
                    />
                  ) : (
                    <div className="bg-gray-500 flex items-center justify-center h-full text-white text-xs">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </Link>
            </>
          ) : (
            <NavLink
              to="/login"
              className="hover:text-sky-400 hover:bg-slate-200 hover:bg-opacity-30 py-2 px-3 rounded-xl text-xs md:text-sm"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
