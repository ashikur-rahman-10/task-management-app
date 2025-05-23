import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast, Toaster } from "react-hot-toast";
import useAuth from "../../Hooks/UseAuth";
import UseUsers from "../../Hooks/UseUsers";
import TaskCard from "./TaskCard";
import UseWorksSpaces from "../../Hooks/UseWorksSpaces";

const TeamsTasks = () => {
  const { id } = useParams();
  const teamId = id;
  const { user } = useAuth();
  const { worksSpaces, worksSpacesRefetch } = UseWorksSpaces();
  const navigate = useNavigate();
  const { users, isLoading: usersLoading } = UseUsers();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editTask, setEditTask] = useState(null);

  // Filter/Sort State
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    if (!teamId) return;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/tasks?teamId=${teamId}`);
        const data = await res.json();
        if (Array.isArray(data)) setTasks(data);
        else throw new Error("Failed to fetch tasks");
      } catch (error) {
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTeam = () => {
      setIsLoading(true);
      fetch(`http://localhost:5000/teams/${teamId}`)
        .then((res) => res.json())
        .then((result) => {
          setTeams(result);
          if (Array.isArray(result.members)) setTeamMembers(result.members);
          else throw new Error("No team members");
        })
        .catch(() => toast.error("Failed to load team"))
        .finally(() => setIsLoading(false));
    };

    fetchTasks();
    fetchTeam();
  }, [teamId]);

  const workspaceId = teams.workspaceId;

  const thisWorksSpace = worksSpaces?.find((w) => w?._id === workspaceId);
  console.log(thisWorksSpace);

  // Filtering and Sorting Logic
  useEffect(() => {
    let updated = [...tasks];

    if (statusFilter !== "All") {
      updated = updated.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "All") {
      updated = updated.filter((task) => task.priority === priorityFilter);
    }

    if (sortOrder === "Newest") {
      updated.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sortOrder === "Oldest") {
      updated.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortOrder === "HighPriority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      updated.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortOrder === "LowPriority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      updated.sort((a, b) => order[b.priority] - order[a.priority]);
    }

    setFilteredTasks(updated);
  }, [tasks, statusFilter, priorityFilter, sortOrder]);

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
    const description = form.description.value.trim();
    const dueDate = form.dueDate.value;
    const priority = form.priority.value;

    if (!title || !description || !dueDate || !priority) {
      toast.error("All fields are required");
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      assignedTo: selectedMembers,
      status: editTask ? editTask.status : "Pending",
      taskCreatedBy: user.email,
      teamId,
    };

    setIsLoading(true);
    try {
      const url = editTask
        ? `http://localhost:5000/tasks/${editTask._id}`
        : "http://localhost:5000/tasks";
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
      } else {
        throw new Error("Failed to save task");
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
        `http://localhost:5000/tasks/${taskId}?taskCreatedBy=${user.email}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (result.deletedCount > 0) {
        toast.success("Task deleted");
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
      const res = await fetch(`http://localhost:5000/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, userEmail: user.email }),
      });
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

  return (
    <div className="p-4 max-w-7xl w-full mx-auto">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Helmet>
        <title>Tasks</title>
      </Helmet>
      <h1 className="text-2xl font-bold text-center mb-6">Tasks</h1>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          className="border px-2 py-1 text-xs rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="border px-2 py-1 text-xs rounded"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          className="border px-2 py-1 text-xs rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="Newest">Due Date: Newest</option>
          <option value="Oldest">Due Date: Oldest</option>
          <option value="HighPriority">Priority: High → Low</option>
          <option value="LowPriority">Priority: Low → High</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 mx-auto w-full md:grid-cols-4 gap-4">
          {filteredTasks.map((task) => (
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
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={editTask?.description}
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
