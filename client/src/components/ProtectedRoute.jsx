// client/src/components/ProtectedRoute.jsx (New file)
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <Typography>Loading...</Typography>; // Or a spinner
  }

  if (!isAuthenticated) {
    // Redirect to login or prompt login, then navigate back
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname, // Go back to the protected path after login
      },
    });
    return null; // Don't render children until authenticated
  }

  return children;
};

export default ProtectedRoute;
