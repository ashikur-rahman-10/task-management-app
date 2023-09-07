import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./Providers/AuthProvider.jsx";
import router from "./Routes/Routes.jsx";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <HelmetProvider>
                <RouterProvider router={router} />
            </HelmetProvider>
        </AuthProvider>
    </React.StrictMode>
);
