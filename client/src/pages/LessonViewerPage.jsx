import React from 'react'
import { Typography, Box } from "@mui/material";

function LessonViewerPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1">
        Course Overview
      </Typography>
      <Typography variant="body1">
        This is where the generated lessons will be
        displayed.
      </Typography>
    </Box>
  );
}

export default LessonViewerPage