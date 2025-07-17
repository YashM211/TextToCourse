// client/src/components/PromptForm.jsx
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function PromptForm() {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generating course for:", topic);
    // TODO: Integrate with backend API call in a later milestone
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
      >
        Generate Course
      </Button>
    </Box>
  );
}

export default PromptForm;
