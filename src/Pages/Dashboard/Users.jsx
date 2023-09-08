import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const Users = () => {
    const [users, setUsers] = useState([]);

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {users.map((user) => (
                    <div key={user.id}>
                        <div className="w-full md:w-[270px] shadow-lg p-5 flex flex-col items-center justify-center space-y-2 rounded-md">
                            <img
                                className="w-20 h-20 rounded-full"
                                src={user?.photoURL}
                                alt={user.name}
                            />
                            <p>Name: {user?.name}</p>
                            <p>Team: {user?.teamName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;
