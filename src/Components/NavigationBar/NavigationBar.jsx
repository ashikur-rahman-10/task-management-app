import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import CustomLoader from "../customLoader/CustomLoader";

const NavigationBar = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]);

    const handleTheme = (event) => {
        if (event.target.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };
    if (loading) {
        return <CustomLoader></CustomLoader>;
    }
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
                <Link to={"/"} className="hover:text-info">
                    Dashboard
                </Link>
            </li>

            <li>
                <Link to={"/tasks"} className="hover:text-info">
                    Tasks
                </Link>
            </li>
            <li>
                <Link to={"/create-task"} className="hover:text-info">
                    Create Task
                </Link>
            </li>

            <li>
                <Link to={"/teams"} className="hover:text-info">
                    Teams
                </Link>
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
                <div className="navbar-end pr-4 flex items-center">
                    <div className="px-5">
                        <label className="swap swap-rotate">
                            <input type="checkbox" onChange={handleTheme} />
                            <svg
                                className="swap-on fill-current w-8"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                            <svg
                                className="swap-off fill-current w-8"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                        </label>
                    </div>

                    {user ? (
                        <div className="dropdown dropdown-end ">
                            <label
                                tabIndex={0}
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <Link
                                    to={"/profile"}
                                    className="w-10 h-10 outline outline-success rounded-full"
                                >
                                    {user.photoURL ? (
                                        <img
                                            className="rounded-full"
                                            src={user.photoURL}
                                        />
                                    ) : (
                                        <img src="" />
                                    )}
                                </Link>
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
