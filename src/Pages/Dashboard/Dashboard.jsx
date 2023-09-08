import React, { useEffect, useState } from "react";
import Greeting from "../../Components/Greetings/Greetings";
import img from "../../assets/user-interface.gif";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [usersCount, setUsersCount] = useState(0);
    const [tasksCount, setTasksCount] = useState(0);
    const [teamsCount, setTeamsCount] = useState(0);
    const [pendingTasksCount, setPendingTasksCount] = useState(0);
    const [inProgressTasksCount, setInProgressTasksCount] = useState(0);
    const [completedTasksCount, setCompletedTasksCount] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null); // Track selected card

    useEffect(() => {
        // Retrieve and calculate counts from your data source (localStorage or API)
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const teams = JSON.parse(localStorage.getItem("teams")) || [];

        setUsersCount(users.length);
        setTasksCount(tasks.length);
        setTeamsCount(teams.length);

        const pendingTasks = tasks.filter((task) => task.status === "Pending");
        const inProgressTasks = tasks.filter(
            (task) => task.status === "In Progress"
        );
        const completedTasks = tasks.filter(
            (task) => task.status === "Completed"
        );

        setPendingTasksCount(pendingTasks.length);
        setInProgressTasksCount(inProgressTasks.length);
        setCompletedTasksCount(completedTasks.length);
    }, []);

    return (
        <div className="py-8">
            {/* Greeting Section */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center bg-white px-4 mt-5">
                <Greeting />
                <img className="h-[250px]" src={img} alt="" />
            </div>
            {/* Dashboard Section */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mt-4">
                {/* Total Users Card */}
                <Link
                    to={"/users"}
                    className="bg-purple-200 flex items-center justify-center flex-col h-[150px] p-4 rounded-md shadow-md cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-2">Total Users</h2>
                    <p className="text-3xl font-bold">{usersCount}</p>
                </Link>

                {/* Total Tasks Card */}
                <Link
                    to={"/tasks"}
                    className="bg-pink-200 flex items-center justify-center flex-col h-[150px] p-4 rounded-md shadow-md cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-2">Total Tasks</h2>
                    <p className="text-3xl font-bold">{tasksCount}</p>
                </Link>

                {/* Total Teams Card */}
                <Link
                    to={"/teams"}
                    className="bg-slate-200 flex items-center justify-center flex-col h-[150px] p-4 rounded-md shadow-md cursor-pointer"
                >
                    <h2 className="text-lg font-semibold mb-2">Total Teams</h2>
                    <p className="text-3xl font-bold">{teamsCount}</p>
                </Link>

                {/* Pending Tasks Card */}
                <div className="bg-red-300 flex items-center justify-center flex-col h-[150px] p-4 rounded-md shadow-md cursor-pointer">
                    <h2 className="text-lg font-semibold mb-2">
                        Pending Tasks
                    </h2>
                    <p className="text-3xl font-bold">{pendingTasksCount}</p>
                </div>

                {/* In Progress Tasks Card */}
                <div className="bg-sky-300 flex items-center justify-center flex-col h-[150px] p-4 rounded-md shadow-md cursor-pointer">
                    <h2 className="text-lg font-semibold mb-2">
                        In Progress Tasks
                    </h2>
                    <p className="text-3xl font-bold">{inProgressTasksCount}</p>
                </div>

                {/* Completed Tasks Card */}
                <div className="bg-green-300 flex items-center justify-center flex-col h-[150px] p-4 rounded-md shadow-md cursor-pointer">
                    <h2 className="text-lg font-semibold mb-2">
                        Completed Tasks
                    </h2>
                    <p className="text-3xl font-bold">{completedTasksCount}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
