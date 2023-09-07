import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TaskDetails = () => {
    const [task, setTask] = useState([]);

    const { id } = useParams();
    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const filteredTask = tasks.find((t) => t?.id == id);
        if (filteredTask) {
            setTask(filteredTask);
        }
    }, []);

    const {
        title,
        description,
        dueDate,
        priority,
        assignedTo,
        status,
        taskCreatedBy,
    } = task;

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

    if (!task) {
        return (
            <div className="w-full min-h-[100vh] flex items-center justify-center">
                Loading...
            </div>
        );
    }
    return (
        <div className="pt-8 w-full max-w-7xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl text-center py-6">{title}</h1>

            <div className="">
                <p className="">Due date: {dueDate}</p>
                <p className="">Created By: {taskCreatedBy}</p>
                <p className={`${priorityClass}`}>
                    Priority level: <span>{priority}</span>
                </p>
                <p className="">Status: {status}</p>
                <p className={`  `}>Assign to: {assignedTo}</p>
            </div>
            <div className="py-4">
                <p className="text-lg font-medium">Task Description:</p>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default TaskDetails;
