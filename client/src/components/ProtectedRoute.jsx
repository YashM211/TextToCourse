// client/src/components/ProtectedRoute.jsx
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // 1. Handle Auth0's initial loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading authentication status...</Typography>
      </Box>
    );
  }

  // 2. If not authenticated after loading, redirect to login
  if (!isAuthenticated) {
    // Optionally, you can trigger loginWithRedirect directly here
    // or return a Navigate component to a login page/route.
    // For a smoother UX, often loginWithRedirect is called immediately.
    // However, if you want to show a message first, use Navigate.

    // Calling loginWithRedirect directly for immediate action:
    loginWithRedirect();
    return null; // Don't render anything while redirecting

    // Alternative: Navigate to a dedicated login page (if you had one)
    // return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
