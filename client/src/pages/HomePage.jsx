// client/src/pages/HomePage.jsx
import React from "react";
import { Typography, Box } from "@mui/material";
import PromptForm from "../components/PromptForm"; // Will create this

function HomePage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Your Course
      </Typography>
      <Typography variant="body1" paragraph>
        Enter any topic you'd like to learn about, and our AI will create a
        structured course for you.
      </Typography>
      <PromptForm />
    </Box>
  );
}

export default HomePage;
