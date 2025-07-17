// client/src/components/PromptForm.jsx (UPDATED for API call)
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import useApi from "../utils/api"; // Import the new hook
import { useNavigate } from "react-router-dom"; // To redirect after generation

function PromptForm() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const { callApi } = useApi(); // Use the custom API hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call your backend API to generate the course
      const data = await callApi("/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });
      console.log("Course generated:", data);
      navigate(`/course/${data._id}`); // Redirect to the new course overview page
    } catch (error) {
      console.error("Error generating course:", error);
      // Display error to user
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ alignSelf: "flex-start" }}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Generating..." : "Generate Course"}
      </Button>
    </Box>
  );
}

export default PromptForm;
