// client/src/App.jsx (UPDATED)
import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import SidebarNavigation from "./components/SidebarNavigation";
import HomePage from "./pages/HomePage";
import CourseOverviewPage from "./pages/CourseOverviewPage";
import LessonViewerPage from "./pages/LessonViewerPage";
import LoginPage from "./pages/LoginPage"; // This can be removed or simplified later
import SignupPage from "./pages/SignupPage"; // This can be removed or simplified later
import ProtectedRoute from './components/ProtectedRoute'; // New import


// AUTH0 IMPORTS
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  if (isLoading) {
    return <Typography>Loading authentication...</Typography>; // Or a proper spinner
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Text-to-Learn
          </Typography>
          {/* Conditional Login/Logout Buttons */}
          {!isAuthenticated ? (
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login / Sign Up
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* Sidebar - uncomment and connect when ready */}
      {/* <SidebarNavigation /> */}

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: "64px" /* Adjust for AppBar height */ }}
      >
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Removed direct /login /signup as Auth0 handles it */}
            <Route
              path="/course/:id"
              element={
                <ProtectedRoute>
                  <CourseOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lesson/:id"
              element={
                <ProtectedRoute>
                  <LessonViewerPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
