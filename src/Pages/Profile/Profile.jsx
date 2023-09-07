import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";

const Profile = ({ userEmail }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const { user } = useAuth();
    // console.log(user);
    useEffect(() => {
        // Retrieve the list of users from local storage or your data source
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find the user with the matching email
        const matchedUser = users.find((u) => u.email == user.email);
        // console.log(matchedUser);

        if (matchedUser) {
            // Set the user state to the matched user
            setLoggedUser(matchedUser);
        }
    }, [userEmail]);

    if (!user) {
        return (
            <div className="w-full min-h-[100vh] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full min-h-[90vh] flex items-center justify-center px-4">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl">User Profile</h1>
                <img
                    className="w-48 h-48 rounded-full mt-10 outline outline-success hover:scale-150 hover:rounded-sm duration-1000"
                    src={loggedUser?.photoURL}
                    alt={`${loggedUser?.name}'s profile`}
                />
                <p className="text-center mt-4 max-w-[400px] text-[#737373]">
                    {loggedUser?.bio}
                </p>
                <div className="mt-8">
                    <h2 className="text-2xl">Name: {loggedUser?.name}</h2>
                    <p className="text-xl">Email: {loggedUser?.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
