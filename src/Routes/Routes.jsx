import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Login from "../Pages/LoginRegistration/Login";
import Register from "../Pages/LoginRegistration/Register";
import Profile from "../Pages/Profile/Profile";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Workspace from "../Pages/Workspace/Workspace";
import TeamsTasks from "../Pages/TeamsTasks/TeamsTasks";

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
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },

      // {
      //   path: "/workspace/:id/teams/:teamId/tasks",
      //   element: <TasksPage></TasksPage>,
      // },
      {
        path: "/workspace/:id",
        element: (
          <PrivateRoute>
            <Workspace />
          </PrivateRoute>
        ),
      },

      {
        path: "/teams/:id",
        element: (
          <PrivateRoute>
            <TeamsTasks />
          </PrivateRoute>
        ),
      },

      {
        path: "/",
        element: (
          <PrivateRoute>
            <Dashboard></Dashboard>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
