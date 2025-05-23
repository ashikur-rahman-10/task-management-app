import React from "react";
import UseAxiosSecure from "./UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UseTeamByID = (id) => {
  const [axiosSecure] = UseAxiosSecure();

  const { data: teams = [], refetch: teamsRefetch } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/workspace/teams/${id}`);
      return res.data;
    },
  });
  return { teams, teamsRefetch };
};

export default UseTeamByID;
