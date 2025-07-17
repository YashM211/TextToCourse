import React from "react";
import { Typography, Box } from "@mui/material";

function CourseOverviewPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1">
        Course Overview
      </Typography>
      <Typography variant="body1">
        This is where the generated course modules and lessons will be
        displayed.
      </Typography>
    </Box>
  );
}

export default CourseOverviewPage;
