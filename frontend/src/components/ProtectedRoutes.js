import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("authToken");

    if (!token) {
        // If there's no token, redirect to the login page
        return <Navigate to="/login" ></Navigate>
    }


    return children; // Render children if the user is authenticated
}
export default ProtectedRoute;