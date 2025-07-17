// client/src/App.jsx
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
import SidebarNavigation from "./components/SidebarNavigation"; // Will create this
import HomePage from "./pages/HomePage"; // Will create this
import CourseOverviewPage from "./pages/CourseOverviewPage"; // Will create this
import LessonViewerPage from "./pages/LessonViewerPage"; // Will create this
import LoginPage from "./pages/LoginPage"; // Will create this
import SignupPage from "./pages/SignupPage"; // Will create this

function App() {
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
          {/* Example Nav Buttons - replace with proper Auth0 logic later */}
          <Button color="inherit" href="/login">
            Login
          </Button>
          <Button color="inherit" href="/signup">
            Sign Up
          </Button>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/course/:id" element={<CourseOverviewPage />} />
            <Route path="/lesson/:id" element={<LessonViewerPage />} />
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
