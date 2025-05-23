import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import UseUsers from "../../Hooks/UseUsers";

const Users = () => {
    const [userls, setUsers] = useState([]);
    const {users}=UseUsers();

    console.log(users)

    useEffect(() => {
        // Fetch user data from your data source (e.g., local storage)
        const userData = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(userData);
    }, []);

    return (
        <div className="py-8 px-4 md:px-0">
            <Helmet>
                <title>Users</title>
            </Helmet>
            <h1 className="text-center text-2xl md:text-4xl py-8">ALL Users</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2">
                {users.map((user) => (
                    <div key={user._id}>
                        <div className="w-full md:w-[270px] shadow-lg p-5 h-48 flex flex-col items-center  space-y-2 rounded-md cursor-pointer hover:bg-slate-200 duration-300">
                            <img
                                className="w-20 h-20 rounded-full"
                                src={user?.photoURL}
                                alt={user.name}
                            />
                            <p>Name: {user?.name}</p>
                            {
                                user?.teamName && <p>Team: {user?.teamName}</p>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;
