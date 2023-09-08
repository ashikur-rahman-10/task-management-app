import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import CustomLoader from "../../Components/customLoader/CustomLoader";
import { Helmet } from "react-helmet-async";

const Profile = () => {
    const [loggedUser, setLoggedUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    // console.log(userEmail);
    useEffect(() => {
        // Retrieve the list of users from local storage or your data source
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find the user with the matching email
        const matchedUser = users.find((u) => u.email == user?.email);

        if (matchedUser) {
            // Set the user state to the matched user
            setLoggedUser(matchedUser);
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <CustomLoader></CustomLoader>;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const bio = event.target.bio.value;

        // Update the loggedUser's bio
        const updatedUser = {
            ...loggedUser,
            bio: bio,
        };

        // Retrieve the list of users from local storage or your data source
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Update the user data in the users array
        const updatedUsers = users.map((u) => {
            if (u.email === loggedUser.email) {
                return updatedUser;
            }
            return u;
        });

        // Update local storage with the updated user data
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Update the loggedUser state
        setLoggedUser(updatedUser);

        // Close the modal
        document.getElementById("my_modal_5").close();
    };

    return (
        <div className="w-full min-h-[90vh] flex items-center justify-center px-4">
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <div className="flex flex-col items-center justify-center">
                <img
                    className="w-48 h-48 rounded-full mt-10 outline outline-success hover:scale-150 hover:rounded-sm duration-1000"
                    src={loggedUser?.photoURL}
                    alt={`${loggedUser?.name}'s profile`}
                />
                <p className="text-center mt-4 max-w-[400px] text-[#737373]">
                    {loggedUser?.bio}
                </p>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button
                    className="px-4 py-1 bg-info text-white rounded-2xl hover:bg-blue-600 "
                    onClick={() =>
                        document.getElementById("my_modal_5").showModal()
                    }
                >
                    Edit Bio
                </button>
                <div className="mt-8">
                    <h2 className="text-2xl">Name: {loggedUser?.name}</h2>
                    <p className="text-xl">Email: {loggedUser?.email}</p>
                    <p className="text-xl">Team: {loggedUser?.teamName}</p>
                </div>
            </div>

            <dialog
                id="my_modal_5"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <form onSubmit={handleSubmit}>
                        <div className="md:w-[450px] w-full px-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Bio:
                            </label>
                            <textarea
                                name="bio"
                                required
                                placeholder="your bio....."
                                className="textarea textarea-info w-full h-40"
                                defaultValue={loggedUser?.bio}
                            ></textarea>
                        </div>
                        <div className="w-full flex justify-end pr-6">
                            <button
                                type="submit"
                                className="px-4 py-1 bg-info text-white rounded-2xl hover:bg-blue-600 "
                            >
                                Save Changes
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

export default Profile;
