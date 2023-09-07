import React, { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        if (!user) {
            Swal.fire({
                icon: "info",
                text: "Please Login to Create task.",
                showConfirmButton: false,
                timer: 2500,
            });
            navigate("/login");
            return;
        }
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const dueDate = form.dueDate.value;
        const priority = form.priority.value;
        const assignedTo = form.assignedTo.value;
        const newTask = {
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            status: "Pending",
            taskCreatedBy: user?.displayName,
            id: new Date().getTime(),
        };
        // Get the existing tasks array from local storage or initialize an empty array
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Add the new user to the array
        tasks.push(newTask);

        // Save the updated array of tasks back to local storage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        form.reset();

        // Show the SweetAlert2 for successful task creation
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Task created successfully!",
            showConfirmButton: false,
            timer: 2000,
        });
    };

    return (
        <div className="w-full min-h-[90vh] pt-8 flex items-center justify-center">
            <div className=" w-full rounded px-4 pt-6 pb-8 mb-4 flex flex-col justify-center items-center">
                <h2 className="text-2xl md:text-4xl font-medium mb-8 text-center">
                    Create New Task
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-[450px] shadow-md shadow-[#9BC1DE] py-8 rounded-lg space-y-3"
                >
                    <div className="md:w-[450px] w-full px-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title:
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="input input-info w-full"
                        />
                    </div>
                    <div className="md:w-[450px] w-full px-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description:
                        </label>
                        <textarea
                            name="description"
                            required
                            className="textarea textarea-info w-full h-40"
                        ></textarea>
                    </div>
                    <div className="md:w-[450px] w-full px-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Due Date:
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            required
                            className="input input-info w-full"
                        />
                    </div>
                    <div className="md:w-[450px] w-full px-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Priority:
                        </label>
                        <div>
                            <input
                                type="radio"
                                name="priority"
                                value="Low"
                                required
                                className="mr-2"
                            />{" "}
                            Low
                            <input
                                type="radio"
                                name="priority"
                                value="Medium"
                                required
                                className="mr-2 ml-4"
                            />{" "}
                            Medium
                            <input
                                type="radio"
                                name="priority"
                                value="High"
                                required
                                className="mr-2 ml-4"
                            />{" "}
                            High
                        </div>
                    </div>
                    <div className="md:w-[450px] w-full px-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Assigned To:
                        </label>
                        <input
                            type="text"
                            name="assignedTo"
                            required
                            className="input input-info w-full"
                        />
                    </div>
                    <div className="text-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
