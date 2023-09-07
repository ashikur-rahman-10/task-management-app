import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Login from "../Pages/LoginRegistration/Login";
import Register from "../Pages/LoginRegistration/Register";
import Profile from "../Pages/Profile/Profile";
import CreateTask from "../Pages/CreateTask/CreateTask";
import Tasks from "../Pages/Tasks/Tasks";
import TaskDetails from "../Pages/TaskDetails/TaskDetails";

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
            {
                path: "/create-task",
                element: <CreateTask></CreateTask>,
            },
            {
                path: "/",
                element: <Tasks></Tasks>,
            },
            {
                path: "/task-details/:id",
                element: <TaskDetails></TaskDetails>,
            },
        ],
    },
]);

export default router;
