import React from "react";
import { Link } from "react-router-dom";

const TaskCard = ({ task }) => {
    const { title, dueDate, priority, assignedTo, status, id } = task;

    // Define a CSS class based on the priority level
    let priorityClass = "";
    switch (priority) {
        case "Low":
            priorityClass = "text-yellow-400 font-semibold"; // Blue for low priority
            break;
        case "Medium":
            priorityClass = "text-orange-500 font-semibold"; // Orange for medium priority
            break;
        case "High":
            priorityClass = "text-red-700 font-semibold"; // Red for high priority
            break;
        default:
            break;
    }

    return (
        <div className="border p-5 rounded-lg w-72 shadow-lg space-y-2">
            <h1 className="font-medium">{title}</h1>
            <div className="">
                <p className={`text-xs font-medium `}>Due date: {dueDate}</p>
                <p className={`text-xs font-medium`}>
                    Priority level:{" "}
                    <span className={`${priorityClass}`}>{priority}</span>
                </p>
                <p className={`text-xs font-medium `}>Status: {status}</p>
                <p className={`text-xs font-medium underline`}>
                    Assign to: {assignedTo}
                </p>
            </div>
            <div className="w-full flex justify-end">
                <Link
                    to={`/task-details/${id}`}
                    className="py-1 px-4 rounded-2xl bg-info text-white font-medium hover:bg-blue-600 hover:scale-105"
                >
                    Details
                </Link>
            </div>
        </div>
    );
};

export default TaskCard;
