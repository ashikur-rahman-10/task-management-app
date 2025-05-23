import React from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UseUsers = () => {
    const [axiosSecure] = UseAxiosSecure();
    
    const { data: users = [], refetch: usersRefetch } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users`);
            return res.data;
        },
    });
    return { users, usersRefetch }
};

export default UseUsers;