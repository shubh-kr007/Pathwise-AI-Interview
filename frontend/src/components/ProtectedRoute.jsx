import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check for the authentication token in local storage
  const isAuthenticated = !!localStorage.getItem('token');

  // If the user is authenticated, render the nested routes (using Outlet).
  // Otherwise, redirect them to the /auth page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;