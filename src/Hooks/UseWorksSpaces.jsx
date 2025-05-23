import React from "react";
import UseAxiosSecure from "./UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UseWorksSpaces = () => {
  const [axiosSecure] = UseAxiosSecure();

  const { data: worksSpaces = [], refetch: worksSpacesRefetch } = useQuery({
    queryKey: ["worksSpaces"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/works-spaces`);
      return res.data;
    },
  });
  return { worksSpaces, worksSpacesRefetch };
};

export default UseWorksSpaces;
