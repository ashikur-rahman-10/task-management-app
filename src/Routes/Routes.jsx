import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Login from "../Pages/LoginRegistration/Login";
import Register from "../Pages/LoginRegistration/Register";
import Profile from "../Pages/Profile/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: "/login",
                element: <Login></Login>,
            },
            {
                path: "/register",
                element: <Register></Register>,
            },
            {
                path: "/profile",
                element: <Profile></Profile>,
            },
        ],
    },
]);

export default router;
