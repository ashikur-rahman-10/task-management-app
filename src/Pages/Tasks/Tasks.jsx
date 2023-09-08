import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { Helmet } from "react-helmet-async";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortCriteria, setSortCriteria] = useState("DueDate");
    const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order is ascending

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);

    const filteredTasks = tasks.filter((task) => {
        if (filterStatus === "All" || task.status === filterStatus) {
            return true;
        }
        return false;
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
        let comparison = 0;

        switch (sortCriteria) {
            case "DueDate":
                comparison = new Date(a.dueDate) - new Date(b.dueDate);
                break;
            case "Priority":
                const priorityOrder = {
                    Low: 1,
                    Medium: 2,
                    High: 3,
                };
                comparison =
                    priorityOrder[a.priority] - priorityOrder[b.priority];
                break;
            case "AssignTo":
                comparison = a.assignedTo.localeCompare(b.assignedTo);
                break;
            default:
                break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
    });

    const toggleSortOrder = () => {
        // Toggle between ascending and descending order
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const handleDeleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };

    return (
        <div className="pt-8 w-full max-w-7xl mx-auto flex items-center justify-center">
            <Helmet>
                <title>Tasks</title>
            </Helmet>
            <div>
                <h1 className="text-3xl text-center my-8">All tasks</h1>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center py-4 text-xs">
                    <div className="flex items-center space-x-2">
                        <label className="font-medium">Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border rounded-md p-1"
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="font-medium">Sort by:</label>
                        <select
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                            className="border rounded-md p-1"
                        >
                            <option value="DueDate">Due Date</option>
                            <option value="Priority">Priority</option>
                            <option value="AssignTo">Assign To</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={toggleSortOrder}
                            className="border rounded-md p-1"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
                {sortedTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-4">
                        {sortedTasks.map((t) => (
                            <TaskCard
                                key={t.id}
                                task={t}
                                onDelete={handleDeleteTask}
                            ></TaskCard>
                        ))}
                    </div>
                ) : (
                    <div className="w-full min-h-[80vh] flex items-center justify-center">
                        <h1 className="text-2xl text-[#737373]">
                            There are no tasks to show
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
