﻿import React from "react";
import { Navigate } from "react-router-dom";
import { useCookieWatcher } from "@fcannizzaro/react-use-cookie-watcher";

const ProtectedRoute = ({ children }) => {
    const cookieExists = useCookieWatcher("Id", {
        checkEvery: 100
    });

    if (!cookieExists) {
        return <Navigate to="/home" replace />;
    };

    return children;
};

export default ProtectedRoute;