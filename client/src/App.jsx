// client/src/App.jsx (IMPROVED UI - Centralized Container)
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import {
  Box,
  Container, // Ensure Container is imported
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
import ProtectedRoute from "./components/ProtectedRoute";
import MyCoursesPage from "./pages/MyCoursesPage";

const drawerWidth = 240;

function App() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  if (isLoading) {
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
    <Box sx={{ display: "flex", width: "100vw" }}>
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
          p: 3, // Global padding around all page content
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${0}px` }, // Margin for sidebar
          mt: "64px", // Adjust for AppBar height (default Toolbar height)
        }}
      >
        {/* <Toolbar />{" "} */}
        {/* This empty Toolbar pushes content below the fixed AppBar */}
        {/* IMPORTANT: Move the Container here to wrap all routes */}
        <Container maxWidth="md" sx={{ p: 0 }}>
          {/* Use maxWidth="lg" or "md" as desired. Added p:0 to ensure no extra padding is added by Container itself if it has default */}
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
