// client/src/components/PromptForm.jsx (UPDATED)
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material"; // Added CircularProgress and Typography for better UX
import useApi from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // <--- NEW: Import useAuth0 hook

function PromptForm() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error messages
  const { callApi } = useApi();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0(); // <--- NEW: Destructure Auth0 state and methods

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    // <--- NEW: Authentication check
    if (isLoading) {
      // If Auth0 is still loading, wait or show a message
      console.log("Auth0 is still loading, cannot proceed with generation.");
      setLoading(false);
      // Optionally, show a temporary message to the user
      setError("Authentication status is still loading. Please wait a moment.");
      return;
    }
    // onClick={() => loginWithRedirect()}

    if (!isAuthenticated) {
      // User is not logged in, redirect to login page
      console.log("User not authenticated. Redirecting to login.");
      await loginWithRedirect({
        appState: {
          returnTo: window.location.pathname, // Optional: return to the current page after login
        },
      });
      setLoading(false); // Stop loading state as we're redirecting
      return; // Stop further execution
    }
    // <--- END NEW: Authentication check

    try {
      const data = await callApi("/generate-course", {
        // Corrected API path to include /api
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });
      console.log("Course generated:", data);
      navigate(`/courses/${data._id}`);
    } catch (err) {
      console.error("Error generating course:", err);
      // Display a user-friendly error message
      setError(err.message || "Failed to generate course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Enter your course topic"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., Intro to React Hooks, Basics of Copyright Law, Quantum Physics for Beginners"
        required
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ alignSelf: "flex-start" }}
        // Disable button if loading (API call or Auth0 status)
        // or if topic is empty
        disabled={loading || isLoading || !topic.trim()}
      >
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Generating...
          </Box>
        ) : isLoading ? (
          "Checking login status..."
        ) : (
          "Generate Course"
        )}
      </Button>
      {/* Optional: Show a message while Auth0 is loading */}
      {isLoading && (
        <Typography variant="body2" color="text.secondary">
          Checking your login status. Please wait...
        </Typography>
      )}
    </Box>
  );
}

export default PromptForm;
