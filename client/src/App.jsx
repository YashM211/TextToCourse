// client/src/App.jsx (UPDATED FOR LAYOUT AND ROUTING)
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom"; // Import Outlet
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import SidebarNavigation from "./components/SidebarNavigation";
import HomePage from "./pages/HomePage";
import CourseOverviewPage from "./pages/CourseOverviewPage";
import LessonViewerPage from "./pages/LessonViewerPage";
import ProtectedRoute from "./components/ProtectedRoute"; // For protected routes
import MyCoursesPage from "./pages/MyCoursesPage";
// Define constants for drawer width
const drawerWidth = 240;

function App() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  if (isLoading) {
    // Global loading for Auth0 initialization
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading authentication...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar (Top Bar) */}
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

      {/* Sidebar Navigation */}
      {isAuthenticated && <SidebarNavigation drawerWidth={drawerWidth} />}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }, // Margin for sidebar
          mt: "64px", // Adjust for AppBar height
        }}
      >
        <Toolbar />{" "}
        {/* This empty Toolbar pushes content below the fixed AppBar */}
        <Container maxWidth="lg">
          <Routes>
            {/* Public Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Nested routes for authenticated users */}
              <Route
                path="/courses/:courseId"
                element={<CourseOverviewPage />}
              />
              <Route
                path="/courses/:courseId/modules/:moduleId/lessons/:lessonId"
                element={<LessonViewerPage />}
              />
              {/* Add a route for "My Courses" later */}
              <Route path="/my-courses" element={<MyCoursesPage />} />
            </Route>

            {/* Catch-all for undefined routes */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
