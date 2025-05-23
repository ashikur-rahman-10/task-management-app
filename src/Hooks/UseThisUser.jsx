import { useEffect, useState } from "react";
import UseAxiosSecure from "./UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useThisUser = (email) => {
  const [axiosSecure] = UseAxiosSecure();

  const {
    data: client = null,
    isLoading: clientLoading,
    refetch: usersRefetch,
  } = useQuery({
    queryKey: ["user", email],
    enabled: !!email, // only run if email exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}`);
      return res.data;
    },
  });

  return { client, clientLoading, usersRefetch };
};

export default useThisUser;
