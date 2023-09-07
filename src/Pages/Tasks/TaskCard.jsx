import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const TaskCard = ({ task }) => {
    const { title, dueDate, priority, assignedTo, id, status } = task;

    // Define a CSS class based on the priority level
    let priorityClass = "";
    switch (priority) {
        case "Low":
            priorityClass = "text-yellow-400 font-semibold";
            break;
        case "Medium":
            priorityClass = "text-orange-400 font-semibold";
            break;
        case "High":
            priorityClass = "text-red-700 font-semibold";
            break;
        default:
            break;
    }

    // Define a shadow color based on the status
    let shadowColor = "";
    switch (status) {
        case "Pending":
            shadowColor = "shadow-red-400";
            break;
        case "In Progress":
            shadowColor = "shadow-sky-400";
            break;
        case "Completed":
            shadowColor = "shadow-green-400";
            break;
        default:
            break;
    }

    // Function to update the status and close the modal
    const handleStatusChange = (event) => {
        event.preventDefault();
        const newStatus = event.target.status.value;
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const updatedTasks = tasks.map((task) => {
            if (task.id === id) {
                return {
                    ...task,
                    status: newStatus,
                };
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));

        // Show SweetAlert2 message
        Swal.fire({
            icon: "success",
            title: "Status Changed Successfully",
            showConfirmButton: false,
            timer: 1200,
        }).then(() => {
            // Reload the page
            window.location.reload();
        });

        // Close the modal
        document.getElementById(`${id}`).close();
    };

    return (
        <div
            className={`border p-5 rounded-lg w-72 space-y-2 shadow-md ${shadowColor}`}
        >
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
            <div className="w-full flex justify-end gap-4">
                <button
                    className="py-1 px-4 rounded-2xl bg-yellow-400 text-white font-medium hover:bg-yellow-600 hover:scale-105 text-xs"
                    onClick={() => document.getElementById(`${id}`).showModal()}
                >
                    Change Status
                </button>
                <Link
                    to={`/task-details/${id}`}
                    className="py-1 px-4 rounded-2xl bg-info text-white font-medium hover:bg-blue-600 hover:scale-105"
                >
                    Details
                </Link>
            </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id={id} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className="text-center">{title}</h1>
                    <form
                        onSubmit={handleStatusChange}
                        className="md:w-[450px] w-full px-4"
                    >
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Status:
                        </label>
                        <div>
                            <input
                                type="radio"
                                name="status"
                                value="Pending"
                                required
                                className="mr-2"
                            />
                            Pending
                            <input
                                type="radio"
                                name="status"
                                value="In Progress"
                                required
                                className="mr-2 ml-4"
                            />
                            In Progress
                            <input
                                type="radio"
                                name="status"
                                value="Completed"
                                required
                                className="mr-2 ml-4"
                            />
                            Completed
                        </div>
                        <div className="w-full flex justify-end items-end">
                            <button
                                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 hover:scale-105"
                                // onClick={handleStatusChange}
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                    <div className="modal-action">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() =>
                                document.getElementById(`${id}`).close()
                            }
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default TaskCard;
