import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import CustomLoader from "../Components/customLoader/CustomLoader";

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { user, loading } = useAuth();
    if (loading) {
        return <CustomLoader></CustomLoader>;
    }
    if (user) {
        return children;
    }
    return <Navigate to={"/login"} state={location} replace></Navigate>;
};

export default PrivateRoute;
