import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const Teams = () => {
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        // Retrieve the list of users from local storage or your data source
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);

        // Retrieve the list of teams from local storage or initialize an empty array
        const storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
        setTeams(storedTeams);
    }, []);

    // Function to filter available users for selection
    const getAvailableUsers = () => {
        return users.filter((user) => !user.teamName);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const teamName = form.teamName.value;

        // Create a new team object
        const newTeam = {
            name: teamName,
            members: selectedMembers,
            id: new Date().getTime(),
        };

        // Add the new team to the array of teams
        const updatedTeams = [...teams, newTeam];

        // Save the updated teams array back to localStorage
        localStorage.setItem("teams", JSON.stringify(updatedTeams));

        // Update users' teamName when adding them to the team
        const updatedUsers = users.map((user) => {
            if (selectedMembers.includes(user.id)) {
                return {
                    ...user,
                    teamName: teamName,
                };
            }
            return user;
        });

        // Save the updated users array back to localStorage
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Clear the selected members and close the modal
        setSelectedMembers([]);
        document.getElementById("my_modal_5").close();

        // Show SweetAlert2 notification
        Swal.fire({
            icon: "success",
            title: "Team Created Successfully",
            showConfirmButton: false,
            timer: 1500,
        });

        // Reload the page
        window.location.reload();
    };

    const handleUserSelect = (userId) => {
        if (selectedMembers.includes(userId)) {
            // Remove user from selected members
            const updatedMembers = selectedMembers.filter(
                (id) => id !== userId
            );
            setSelectedMembers(updatedMembers);
        } else {
            // Add user to selected members
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    const handleRemoveMember = (teamId, memberId) => {
        // Remove the member from the team
        const updatedTeams = teams.map((team) => {
            if (team.id === teamId) {
                const updatedMembers = team.members.filter(
                    (id) => id !== memberId
                );
                return {
                    ...team,
                    members: updatedMembers,
                };
            }
            return team;
        });

        // Save the updated teams array back to localStorage
        localStorage.setItem("teams", JSON.stringify(updatedTeams));

        // Update user data to remove the team name
        const updatedUsers = users.map((user) => {
            if (user.id === memberId) {
                return {
                    ...user,
                    teamName: "",
                };
            }
            return user;
        });

        // Save the updated users array back to localStorage
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Show SweetAlert2 notification
        Swal.fire({
            icon: "success",
            title: "Member Removed Successfully",
            showConfirmButton: false,
            timer: 1500,
        });

        // Reload the page
        window.location.reload();
    };

    const handleDeleteTeam = (teamId) => {
        // Remove the team from the teams list
        const updatedTeams = teams.filter((team) => team.id !== teamId);

        // Save the updated teams array back to localStorage
        localStorage.setItem("teams", JSON.stringify(updatedTeams));

        // Update user data to remove the team name for all team members
        const updatedUsers = users.map((user) => {
            if (
                user.teamName === teams.find((team) => team.id === teamId)?.name
            ) {
                return {
                    ...user,
                    teamName: "",
                };
            }
            return user;
        });

        // Save the updated users array back to localStorage
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Show SweetAlert2 notification
        Swal.fire({
            icon: "success",
            title: "Team Deleted Successfully",
            showConfirmButton: false,
            timer: 1500,
        });

        // Reload the page
        window.location.reload();
    };
    return (
        <div className="w-full max-w-7xl py-8 min-h-screen mx-auto px-4">
            <Helmet>
                <title>Teams</title>
            </Helmet>
            <div className="">
                <h1 className="text-center text-2xl md:text-4xl py-8">
                    All Teams
                </h1>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <div className="w-full flex justify-end pb-8">
                    <button
                        className="px-4 py-1 bg-warning text-white rounded-2xl hover:bg-orange-600"
                        onClick={() =>
                            document.getElementById("my_modal_5").showModal()
                        }
                    >
                        Create New Team
                    </button>
                </div>
                <div>
                    <div className="overflow-x-auto w-full max-w-3xl mx-auto">
                        <table className="table table-zebra">
                            {/* head */}
                            <thead>
                                <tr className="bg-slate-900 rounded-t-xl text-white">
                                    <th>#</th>
                                    <th>Team Name</th>
                                    <th>Total Member</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                {teams.map((t, index) => (
                                    <tr key={t.id} className="border-b">
                                        <>
                                            <td>{index + 1}</td>
                                            <td>{t.name}</td>
                                            <td>{t.members.length}</td>
                                            <th className="flex items-center justify-center">
                                                {/* Open the modal using document.getElementById('ID').showModal() method */}
                                                <button
                                                    className="px-4 py-1 bg-info text-white rounded-2xl hover:bg-blue-600 text-xs"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                `${t.id}`
                                                            )
                                                            .showModal()
                                                    }
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    className="px-4 py-1 bg-red-500 text-white rounded-2xl hover:bg-red-600 text-xs ml-2"
                                                    onClick={() =>
                                                        handleDeleteTeam(t.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                                <dialog
                                                    id={t.id}
                                                    className="modal modal-bottom sm:modal-middle"
                                                >
                                                    <div className="modal-box">
                                                        <h3 className="font-bold text-lg">
                                                            {t.name}
                                                        </h3>
                                                        <div className="py-4">
                                                            <p>Team Members:</p>
                                                            <ol className="list-decimal pl-4 pt-3 space-y-2">
                                                                {t.members.map(
                                                                    (
                                                                        memberId
                                                                    ) => {
                                                                        const member =
                                                                            users.find(
                                                                                (
                                                                                    user
                                                                                ) =>
                                                                                    user.id ===
                                                                                    memberId
                                                                            );
                                                                        return (
                                                                            <li
                                                                                className="relative"
                                                                                key={
                                                                                    memberId
                                                                                }
                                                                            >
                                                                                {
                                                                                    member.name
                                                                                }
                                                                                <div className="flex justify-end  absolute top-0 right-4">
                                                                                    <button
                                                                                        className="px-2 py-1 bg-red-500 text-white rounded-2xl hover:bg-red-600 text-xs  ml-2"
                                                                                        onClick={() =>
                                                                                            handleRemoveMember(
                                                                                                t.id,
                                                                                                memberId
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Remove
                                                                                    </button>
                                                                                </div>
                                                                            </li>
                                                                        );
                                                                    }
                                                                )}
                                                            </ol>
                                                        </div>
                                                        <div className="modal-action">
                                                            <form method="dialog">
                                                                {/* if there is a button in form, it will close the modal */}
                                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                                                    ✕
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                            </th>
                                        </>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <dialog
                id="my_modal_5"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="md:w-[450px] w-full px-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Team Name:
                            </label>
                            <input
                                type="text"
                                name="teamName"
                                required
                                className="input input-info w-full"
                            />
                        </div>
                        <div className="md:w-[450px] w-full px-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Select team members:
                            </label>
                            <div className="space-y-2 flex flex-col text-xs">
                                {getAvailableUsers().map((user) => (
                                    <label
                                        key={user.id}
                                        className="inline-flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            value={user.id}
                                            onChange={() =>
                                                handleUserSelect(user.id)
                                            }
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="ml-2">
                                            {user.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="w-full flex justify-end pr-6">
                            <button
                                type="submit"
                                className="px-4 py-1 bg-info text-white rounded-2xl hover:bg-blue-600"
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
        </div>
    );
};

export default Teams;
