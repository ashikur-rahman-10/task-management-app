import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaBarsProgress } from "react-icons/fa6";
import Swal from "sweetalert2";

const TaskCard = ({
  task,
  onDelete,
  onEdit,
  onStatusChange,
  userEmail,
  users,
}) => {
  const { _id, title, dueDate, priority, status, assignedTo, taskCreatedBy } =
    task;
  const isCreator = userEmail === taskCreatedBy;
  const isAssigned = assignedTo.includes(userEmail);

  // Priority colors
  const priorityClass =
    priority === "Low"
      ? "bg-yellow-400 text-white px-2 rounded-full py-[1px] font-medium"
      : priority === "Medium"
      ? "bg-orange-400 text-white px-2 rounded-full py-[1px] font-medium"
      : "bg-red-700 text-white px-2 rounded-full py-[1px] font-medium";

  // Status shadows
  const shadowColor =
    status === "Pending"
      ? "bg-red-200  "
      : status === "In Progress"
      ? "bg-sky-200  "
      : "bg-green-200  ";
  const bgColor =
    status === "Pending"
      ? "text-white rounded-full px-2 py-[1px] font-medium bg-red-400  "
      : status === "In Progress"
      ? "text-white rounded-full px-2 py-[1px] font-medium bg-sky-400  "
      : "text-white rounded-full px-2 py-[1px] font-medium bg-green-400  ";

  // Map email to name
  const getMemberName = (email) => {
    const member = users.find((u) => u.email === email);
    return member?.name || email;
  };

  // Handle status change
  const handleStatusChange = (e) => {
    e.preventDefault();
    const newStatus = e.target.status.value;
    onStatusChange(_id, newStatus);
    document.getElementById(`status-${_id}`).close();
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    Swal.fire({
      text: "Are you sure you want to delete this task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false, // Important! Disables default styling
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(_id);
        Swal.fire({
          text: "The task has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-ok-button",
          },
          buttonsStyling: false,
        });
      }
    });
  };

  return (
    <div
      className={`border p-4 rounded-md md:w-64 space-y-2 h-[155px] shadow-md w-full ${shadowColor}`}
    >
      <h1 className="font-medium">{title}</h1>
      <div className="text-xs flex flex-col gap-1">
        <p>Due: {new Date(dueDate).toLocaleDateString()}</p>
        <p>
          Priority: <span className={priorityClass}>{priority}</span>
        </p>
        <p>
          Status:<span className={bgColor}> {status}</span>
        </p>
      </div>
      <div className="flex justify-end gap-2">
        {isCreator && (
          <>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-white hover:bg-yellow-600"
              onClick={() => onEdit(task)}
            >
              <FaEdit />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              onClick={handleDelete}
            >
              <FaTrashAlt />
            </button>
          </>
        )}
        {(isCreator || isAssigned) && (
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => document.getElementById(`status-${_id}`).showModal()}
          >
            <FaBarsProgress />
          </button>
        )}
      </div>

      {/* Status modal */}
      <dialog id={`status-${_id}`} className="modal">
        <div className="modal-box p-4">
          <h2 className="font-bold">{title}</h2>
          <form
            onSubmit={handleStatusChange}
            autoComplete="off"
            className="space-y-2"
          >
            <label className="block font-medium">Status</label>
            <div className="space-x-4">
              {["Pending", "In Progress", "Completed"].map((s) => (
                <label key={s}>
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    defaultChecked={status === s}
                    required
                    className="mr-1"
                  />
                  {s}
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
          <button
            className="absolute right-2 top-2 text-xl"
            onClick={() => document.getElementById(`status-${_id}`).close()}
          >
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default TaskCard;
