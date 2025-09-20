import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../api/auth_api';

const ProtectedRoute = () => {
    // Check if admin is authenticated with new token system
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected content
    return <Outlet />;
};

export default ProtectedRoute;