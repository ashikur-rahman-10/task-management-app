import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const NavigationBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout()
            .then((result) => {
                navigate("/");
            })
            .catch((error) => {});
    };

    let navbarOptions;
    navbarOptions = (
        <>
            <li>
                <Link to={"/create-task"} className="hover:text-info">
                    Create Task
                </Link>
            </li>
            <li>
                <Link to={"/tasks"} className="hover:text-info">
                    Tasks
                </Link>
            </li>
            <li>
                <a>Item 3</a>
            </li>
            <li>
                {user && (
                    <button
                        onClick={handleLogout}
                        className="text-red-400 font-medium "
                    >
                        Logout
                    </button>
                )}
            </li>
        </>
    );

    return (
        <div className=" bg-gradient-to-r from-black via-[#d4a8e9] text-white to-[#0F0212] border-b border-purple-600 w-full bg-opacity-25">
            <div className="navbar w-full max-w-6xl mx-auto ">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow space-y-2   bg-gradient-to-r from-black via-[#d4a8e9] text-white to-[#0F0212] rounded-box w-52"
                        >
                            {navbarOptions}
                        </ul>
                    </div>
                    <div className="">
                        <Link
                            to={"/"}
                            className=" hover:scale-105 duration-500 rounded-xl px-4 py-2 normal-case text-xs font-medium  md:text-xl"
                        >
                            Task Management
                        </Link>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-4">
                        {navbarOptions}
                    </ul>
                </div>
                <div className="navbar-end pr-4">
                    {user ? (
                        <div className="dropdown dropdown-end ">
                            <label
                                tabIndex={0}
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 outline outline-success rounded-full">
                                    {user.photoURL ? (
                                        <Link to={"/profile"}>
                                            <img src={user.photoURL} />
                                        </Link>
                                    ) : (
                                        <img src="" />
                                    )}
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div>
                            <NavLink
                                to={"/login"}
                                className="hover:text-sky-400 hover:bg-slate-200 hover:bg-opacity-30  py-2 px-3 rounded-xl md:mr-10 mr-5"
                            >
                                Login
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
