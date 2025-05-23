import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import UseUsers from "../../Hooks/UseUsers";
import UseWorksSpaces from "../../Hooks/UseWorksSpaces";
import useAuth from "../../Hooks/UseAuth";
import UseTeamByID from "../../Hooks/UseTeamByID";
import { FaTrash, FaEdit, FaUsers, FaUserPlus } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const Workspace = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { users } = UseUsers();
  const { worksSpaces, worksSpacesRefetch, isLoading, error } =
    UseWorksSpaces();
  const { teams, teamsRefetch } = UseTeamByID(id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [renameTeamId, setRenameTeamId] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [addMembersTeamId, setAddMembersTeamId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const thisWorksSpace = worksSpaces?.find((w) => w?._id === id);

  const sharedEmails = thisWorksSpace?.sharedWith;

  // Filter users who are in sharedWith and not assigned to any team
  const getAvailableUsers = () => {
    const assignedEmails = teams?.flatMap((team) => team.members) || [];
    return users.filter(
      (user) =>
        sharedEmails.includes(user.email) &&
        !assignedEmails.includes(user.email)
    );
  };

  // Live search for sharing workspace
  const handleSearchChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchTerm(inputValue);
    const matched = users.filter((user) =>
      user.email.toLowerCase().includes(inputValue)
    );
    setResults(matched);
  };

  // Add user to sharedWith
  const handleAddToSharedWith = async (email) => {
    try {
      setIsUpdating(true);
      const res = await fetch(
        `http://localhost:5000/works-spaces/shared/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(`Shared with ${email}`);
        worksSpacesRefetch();
      } else {
        toast.error("Already shared");
      }
    } catch (err) {
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle team member selection
  const handleUserSelect = (email) => {
    if (selectedMembers.includes(email)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== email));
    } else {
      setSelectedMembers([...selectedMembers, email]);
    }
  };

  // Create a new team
  const handleCreateTeam = async (event) => {
    event.preventDefault();
    const form = event.target;
    const teamName = form.teamName.value.trim();

    if (!teamName) {
      toast.error("Team name is required");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch(`http://localhost:5000/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          members: selectedMembers,
          workspaceId: id,
          ownersEmail: thisWorksSpace.creatorEmail,
        }),
      });
      const result = await res.json();
      if (result.insertedId) {
        toast.success("Team Created Successfully");
        setSelectedMembers([]);
        document.getElementById("team_modal").close();
        await queryClient.invalidateQueries({ queryKey: ["teams", id] });
        await teamsRefetch();
      } else {
        throw new Error(result.error || "Failed to create team");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Create team error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete a team
  const handleDeleteTeam = async (event, teamId) => {
    event.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the team and all its tasks!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        setIsUpdating(true);
        const res = await fetch(`http://localhost:5000/teams/${teamId}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Team deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });

          toast.success("Team Deleted Successfully");
          await queryClient.invalidateQueries({ queryKey: ["teams", id] });
          await teamsRefetch();
        } else {
          throw new Error("Failed to delete team");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Remove a member from a team
  const handleRemoveMember = async (event, teamId, email) => {
    event.stopPropagation();
    try {
      setIsUpdating(true);
      const res = await fetch(`http://localhost:5000/teams/${teamId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("Member Removed Successfully");
        await queryClient.invalidateQueries({ queryKey: ["teams", id] });
        await teamsRefetch();
      } else {
        throw new Error("Failed to remove member");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Open add members modal
  const handleOpenAddMembers = (event, teamId) => {
    event.stopPropagation();
    setAddMembersTeamId(teamId);
    setSelectedMembers([]);
    document.getElementById("add_members_modal").showModal();
  };

  // Add members to a team
  const handleAddMembers = async (event) => {
    event.preventDefault();
    if (!selectedMembers.length) {
      toast.error("Select at least one member");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch(
        `http://localhost:5000/teams/${addMembersTeamId}/add-members`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ members: selectedMembers }),
        }
      );
      const result = await res.json();
      if (result.modifiedCount > 0) {
        toast.success("Members Added Successfully");
        document.getElementById("add_members_modal").close();
        setAddMembersTeamId(null);
        setSelectedMembers([]);
        await queryClient.invalidateQueries({ queryKey: ["teams", id] });
        await teamsRefetch();
      } else {
        throw new Error(result.error || "Failed to add members");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Open rename modal
  const handleOpenRename = (event, teamId, currentName) => {
    event.stopPropagation();
    setRenameTeamId(teamId);
    setNewTeamName(currentName);
    document.getElementById("rename_modal").showModal();
  };

  // Rename a team
  const handleRenameTeam = async (event) => {
    event.preventDefault();
    if (!newTeamName) {
      toast.error("Team name is required");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch(`http://localhost:5000/teams/${renameTeamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: newTeamName }),
      });
      const result = await res.json();
      if (result.modifiedCount > 0) {
        toast.success("Team Renamed Successfully");
        document.getElementById("rename_modal").close();
        setRenameTeamId(null);
        setNewTeamName("");
        await queryClient.invalidateQueries({ queryKey: ["teams", id] });
        await teamsRefetch();
      } else {
        throw new Error("Failed to rename team");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Navigate to team tasks
  const handleCardClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  if (isLoading) return <div>Loading workspace...</div>;
  if (error)
    return <div>Error: {error.message || "Failed to load workspace"}</div>;
  if (!thisWorksSpace) return <div>Workspace not found</div>;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        {thisWorksSpace.worksSpaceName}
      </h1>

      {thisWorksSpace?.creatorEmail === user?.email && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => document.getElementById("share_modal").showModal()}
            className="px-3 py-1 text-sm md:text-md font-semibold border rounded-lg bg-sky-400 hover:bg-sky-600 duration-200 text-white"
            disabled={isUpdating}
          >
            Share
          </button>
          <button
            onClick={() => document.getElementById("team_modal").showModal()}
            className="px-3 py-1 text-sm md:text-md font-semibold border rounded-lg bg-green-400 hover:bg-green-600 duration-200 text-white"
            disabled={isUpdating}
          >
            Create Team
          </button>
        </div>
      )}

      {/* Teams Cards */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Teams</h2>
        {isUpdating ? (
          <div className="text-center">Updating teams...</div>
        ) : teams && teams.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team._id}
                className="shadow-lg p-4 rounded-md bg-gray-100 hover:bg-gray-200 transition relative group"
              >
                <div
                  onClick={() => handleCardClick(team._id)}
                  className="cursor-pointer flex flex-col gap-4"
                >
                  <h3 className="text-lg font-semibold">{team.teamName}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById(`team_${team._id}`).showModal();
                    }}
                    className="px-2 py-1 w-fit rounded-lg bg-purple-400 text-white font-semibold text-xs flex gap-4 items-center justify-center"
                    title="View Members"
                    disabled={isUpdating}
                  >
                    <p className="text-sm">Members: {team.members.length}</p>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 ">
                  <div className="flex gap-2"></div>
                  {thisWorksSpace?.creatorEmail === user?.email && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) =>
                          handleOpenRename(e, team._id, team.teamName)
                        }
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Rename Team"
                        disabled={isUpdating}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTeam(e, team._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Delete Team"
                        disabled={isUpdating}
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={(e) => handleOpenAddMembers(e, team._id)}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        title="Add Members"
                        disabled={isUpdating}
                      >
                        <FaUserPlus />
                      </button>
                    </div>
                  )}
                </div>
                {/* Team Members Modal */}
                <dialog
                  id={`team_${team._id}`}
                  className="modal modal-bottom sm:modal-middle"
                >
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">{team.teamName}</h3>
                    <div className="py-4">
                      <p>Team Members:</p>
                      <ol className="list-decimal pl-4 pt-3 space-y-2">
                        {team.members.map((email) => {
                          const member = users.find((u) => u.email === email);
                          return (
                            <li key={email} className="relative">
                              {member?.name || email}
                              {thisWorksSpace?.creatorEmail === user?.email && (
                                <button
                                  onClick={(e) =>
                                    handleRemoveMember(e, team._id, email)
                                  }
                                  className="absolute right-4 top-0 px-2 py-1 bg-red-500 text-white rounded-2xl hover:bg-red-600 text-xs"
                                  disabled={isUpdating}
                                >
                                  Remove
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No teams available</p>
        )}
      </div>

      {/* Share Workspace Modal */}
      <dialog id="share_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Share Workspace</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search user by email"
            className="input input-bordered w-full mb-4"
            disabled={isUpdating}
          />
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            {results.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <p>{user.email}</p>
                <button
                  onClick={() => handleAddToSharedWith(user.email)}
                  className="btn btn-xs btn-success"
                  disabled={isUpdating}
                >
                  Add
                </button>
              </div>
            ))}
            {searchTerm && results.length === 0 && (
              <p className="text-sm text-gray-500">No matching users found.</p>
            )}
          </div>
        </div>
      </dialog>

      {/* Create Team Modal */}
      <dialog id="team_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <h3 className="font-bold text-lg">Create New Team</h3>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Team Name:
              </label>
              <input
                type="text"
                name="teamName"
                required
                className="input input-info w-full"
                disabled={isUpdating}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select team members:
              </label>
              <div className="space-y-2 flex flex-col text-xs max-h-60 overflow-y-auto">
                {getAvailableUsers().map((user) => (
                  <label key={user._id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={user.email}
                      checked={selectedMembers.includes(user.email)}
                      onChange={() => handleUserSelect(user.email)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                      disabled={isUpdating}
                    />
                    <span className="ml-2">{user.email}</span>
                  </label>
                ))}
                {getAvailableUsers().length === 0 && (
                  <p className="text-sm text-gray-500">
                    No available users. All users are assigned to teams.
                  </p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="px-4 py-1 bg-info text-white rounded-2xl hover:bg-blue-600"
                disabled={isUpdating}
              >
                Create Team
              </button>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Add Members Modal */}
      <dialog
        id="add_members_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form onSubmit={handleAddMembers} className="space-y-4">
            <h3 className="font-bold text-lg">Add Members to Team</h3>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select team members:
              </label>
              <div className="space-y-2 flex flex-col text-xs max-h-60 overflow-y-auto">
                {getAvailableUsers().map((user) => (
                  <label key={user._id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={user.email}
                      checked={selectedMembers.includes(user.email)}
                      onChange={() => handleUserSelect(user.email)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                      disabled={isUpdating}
                    />
                    <span className="ml-2">{user.email}</span>
                  </label>
                ))}
                {getAvailableUsers().length === 0 && (
                  <p className="text-sm text-gray-500">
                    No available users. All users are assigned to teams.
                  </p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("add_members_modal").close()
                }
                className="px-4 py-1 bg-gray-500 text-white rounded-2xl hover:bg-gray-600"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-green-500 text-white rounded-2xl hover:bg-green-600"
                disabled={isUpdating}
              >
                Add Members
              </button>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Rename Team Modal */}
      <dialog id="rename_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleRenameTeam} className="space-y-4">
            <h3 className="font-bold text-lg">Rename Team</h3>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Team Name:
              </label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
                className="input input-info w-full"
                disabled={isUpdating}
              />
            </div>
            <div className="w-full flex justify-end gap-2">
              <button
                type="button"
                onClick={() => document.getElementById("rename_modal").close()}
                className="px-4 py-1 bg-gray-500 text-white rounded-2xl hover:bg-gray-600"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-blue-500 text-white rounded-2xl hover:bg-blue-600"
                disabled={isUpdating}
              >
                Rename
              </button>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Workspace;
