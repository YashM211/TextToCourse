// client/src/components/LoadingSpinner.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "inherit",
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner;
