import React, { useEffect, useState } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowRight, FaEdit, FaTrashAlt } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const TaskCard = ({ task, onDelete }) => {
    const [loggedUser, SetLoggedUser] = useState([]);
    const { user } = useAuth();
    const { title, dueDate, priority, assignedTo, id, status } = task;
    const navigate = useNavigate();

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

    // Function to delete a task
    const handleDelete = () => {
        Swal.fire({
            text: "Are you sure you want to delete this task?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Delete the task
                onDelete(id);

                Swal.fire("Deleted!", "The task has been deleted.", "success");
            }
        });
    };

    const handleNavigate = (id) => {
        navigate(`/task-details/${id}`);
    };

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const filteredUser = users.find((u) => u?.email == user?.email);
        SetLoggedUser(filteredUser);
    }, [user?.email]);

    // Function to determine if the buttons should be disabled
    const areButtonsDisabled = () => {
        return loggedUser?.teamName !== assignedTo;
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
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        areButtonsDisabled()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-yellow-400 text-white"
                    } font-medium hover:bg-yellow-600 hover:scale-110 text-xs`}
                    onClick={() => document.getElementById(`${id}`).showModal()}
                    disabled={areButtonsDisabled()}
                >
                    <FaEdit className="text-lg"></FaEdit>
                </button>
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        areButtonsDisabled()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white"
                    } font-medium hover:bg-red-600 hover:scale-110 text-xs`}
                    onClick={handleDelete}
                    disabled={areButtonsDisabled()}
                >
                    <FaTrashAlt className="text-lg"></FaTrashAlt>
                </button>

                <button
                    onClick={() => {
                        handleNavigate(id);
                    }}
                    className={`py-1 flex gap-1 items-center px-4 rounded-2xl bg-info text-xs text-white font-medium hover:bg-blue-600 hover:scale-105 ${
                        areButtonsDisabled()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : ""
                    }`}
                    disabled={areButtonsDisabled()}
                >
                    Details <FaArrowRight></FaArrowRight>
                </button>
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
