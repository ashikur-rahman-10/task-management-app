import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./UseAuth";

const UseAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const axiosSecure = axios.create({
    baseURL: "https://todayahead.vercel.app",
    // baseURL: "http://localhost:5000",
  });

  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(error);

        return Promise.reject(error);
      }
    );
  }, [navigate, axiosSecure]);
  return [axiosSecure];
};

export default UseAxiosSecure;
