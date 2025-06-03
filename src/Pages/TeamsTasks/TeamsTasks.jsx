import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast, Toaster } from "react-hot-toast";
import useAuth from "../../Hooks/UseAuth";
import UseUsers from "../../Hooks/UseUsers";
import TaskCard from "./TaskCard";
import UseWorksSpaces from "../../Hooks/UseWorksSpaces";
import CustomLoader from "../../Components/customLoader/CustomLoader";

const TeamsTasks = () => {
  const { id } = useParams();
  const teamId = id;
  const { user } = useAuth();
  const { worksSpaces, worksSpacesRefetch } = UseWorksSpaces();
  const navigate = useNavigate();
  const { users, isLoading: usersLoading } = UseUsers();

  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort order: descending

  useEffect(() => {
    if (!teamId) return;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://todays-ahead.vercel.app/tasks/teams/${teamId}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          // Sort tasks by creation time
          const sortedTasks = data.sort((a, b) =>
            sortOrder === "desc"
              ? new Date(b.createdAt) - new Date(a.createdAt)
              : new Date(a.createdAt) - new Date(b.createdAt)
          );
          setTasks(sortedTasks);
        } else {
          throw new Error("Failed to fetch tasks");
        }
      } catch (error) {
        toast.error("Failed to fetch tasks");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTeam = () => {
      setIsLoading(true);
      fetch(`https://todays-ahead.vercel.app/teams/${teamId}`)
        .then((res) => res.json())
        .then((result) => {
          setTeams(result);
          if (Array.isArray(result.members)) setTeamMembers(result.members);
          else throw new Error("No team members");
        })
        .catch(() => toast.error("Failed to fetch team"))
        .finally(() => setIsLoading(false));
    };

    fetchTasks();
    fetchTeam();
  }, [teamId, sortOrder]); // Add sortOrder to dependencies

  const workspaceId = teams.workspaceId;

  const thisWorksSpace = worksSpaces?.find((w) => w?._id === workspaceId);

  // Handle sort order change
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }

    if (!selectedMembers.length) {
      toast.error("Select at least one member");
      return;
    }

    const form = e.target;
    const title = form.title.value.trim();
    const notes = form.notes.value.trim();
    const dueDate = form.dueDate.value;
    const priority = form.priority.value;

    if (!title || !notes || !dueDate || !priority) {
      toast.error("All fields are required");
      return;
    }

    const taskData = {
      title,
      notes,
      dueDate,
      priority,
      assignedTo: selectedMembers,
      status: editTask ? editTask.status : "Pending",
      taskCreatedBy: user.email,
      teamId,
      createdAt: editTask ? editTask.createdAt : new Date().toISOString(), // Add creation time
    };

    setIsLoading(true);
    try {
      const url = editTask
        ? `https://todays-ahead.vercel.app/tasks/${editTask._id}`
        : "https://todays-ahead.vercel.app/tasks";
      const method = editTask ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const result = await res.json();
      if (editTask ? result.modifiedCount > 0 : result.insertedId) {
        toast.success(editTask ? "Task updated" : "Task created");
        if (editTask) {
          setTasks(
            tasks.map((task) =>
              task._id === editTask._id ? { ...task, ...taskData } : task
            )
          );
        } else {
          setTasks([...tasks, { ...taskData, _id: result.insertedId }]);
        }
        form.reset();
        setSelectedMembers([]);
        setEditTask(null);
        document.getElementById("task_modal").close();
      }
    } catch (error) {
      toast.error("Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://todays-ahead.vercel.app/tasks/${taskId}?taskCreatedBy=${user.email}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (result.deletedCount > 0) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task) => {
    if (user?.email !== task.taskCreatedBy) {
      toast.error("Only creator can edit");
      return;
    }
    setEditTask(task);
    setSelectedMembers(task.assignedTo);
    document.getElementById("task_modal").showModal();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://todays-ahead.vercel.app/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, userEmail: user.email }),
        }
      );
      const result = await res.json();
      if (result.modifiedCount > 0) {
        toast.success("Status updated");
        setTasks(
          tasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberSelect = (email) => {
    setSelectedMembers((prev) =>
      prev.includes(email) ? prev.filter((m) => m !== email) : [...prev, email]
    );
  };

  const getMemberName = (email) => {
    const member = users.find((u) => u.email === email);
    return member?.name || email;
  };

  const PendingTasks = tasks?.filter((t) => t?.status == "Pending");
  const CompletedTasks = tasks?.filter((t) => t?.status == "Completed");
  const InprogressTasks = tasks?.filter((t) => t?.status == "In Progress");

  if (isLoading || !tasks) {
    return <CustomLoader />;
  }

  return (
    <div className="p-4 max-w-7xl w-full mx-auto pt-20 md:pt-0">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Helmet>
        <title>Tasks</title>
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              sortOrder === "desc" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleSortChange("desc")}
          >
            Newest First
          </button>
          <button
            className={`px-4 py-2 rounded ${
              sortOrder === "asc" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleSortChange("asc")}
          >
            Oldest First
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 mx-auto w-full md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-medium">Pending Tasks</h1>
            <div className="flex flex-col gap-4">
              {PendingTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onStatusChange={handleStatusChange}
                  userEmail={user?.email}
                  users={users}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-medium">In Progress Tasks</h1>
            <div className="flex flex-col gap-4">
              {InprogressTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onStatusChange={handleStatusChange}
                  userEmail={user?.email}
                  users={users}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-medium">Completed Tasks</h1>
            <div className="flex flex-col gap-4">
              {CompletedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onStatusChange={handleStatusChange}
                  userEmail={user?.email}
                  users={users}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No tasks found</p>
      )}

      {thisWorksSpace?.creatorEmail === user?.email && (
        <button
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setEditTask(null);
            setSelectedMembers([]);
            document.getElementById("task_modal").showModal();
          }}
          disabled={isLoading || usersLoading}
        >
          Create Task
        </button>
      )}

      <dialog id="task_modal" className="modal">
        <div className="modal-box p-6">
          <form method="dialog">
            <button className="absolute right-2 top-2 text-xl">✕</button>
          </form>
          <h2 className="text-xl font-bold mb-4">
            {editTask ? "Edit Task" : "New Task"}
          </h2>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editTask?.title}
                required
                className="w-full border rounded p-2"
                disabled={isLoading || usersLoading}
              />
            </div>
            <div>
              <label className="block font-medium">Notes</label>
              <textarea
                name="notes"
                defaultValue={editTask?.notes}
                required
                className="w-full border rounded p-2 h-20"
                disabled={isLoading || usersLoading}
              />
            </div>
            <div>
              <label className="block font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                defaultValue={editTask?.dueDate.split("T")[0]}
                required
                className="w-full border rounded p-2"
                disabled={isLoading || usersLoading}
              />
            </div>
            <div>
              <label className="block font-medium">Priority</label>
              <div className="space-x-4">
                {["Low", "Medium", "High"].map((p) => (
                  <label key={p}>
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      defaultChecked={editTask?.priority === p}
                      required
                      disabled={isLoading || usersLoading}
                    />
                    <span className="ml-1">{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-medium">Assign Members</label>
              {usersLoading ? (
                <p className="text-gray-500">Loading members...</p>
              ) : teamMembers.length === 0 ? (
                <p className="text-red-500">No members available</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-scroll">
                  {teamMembers.map((email) => (
                    <label key={email} className="flex items-center">
                      <input
                        type="checkbox"
                        value={email}
                        checked={selectedMembers.includes(email)}
                        onChange={() => handleMemberSelect(email)}
                        className="mr-2"
                        disabled={isLoading || usersLoading}
                      />
                      {getMemberName(email)}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {isLoading
                ? "Saving..."
                : editTask
                ? "Update Task"
                : "Create Task"}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default TeamsTasks;
