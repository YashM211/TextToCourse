// client/src/components/ErrorMessage.jsx
import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ErrorMessage({
  title = "Error",
  message = "Something went wrong. Please try again.",
  sx = {},
}) {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", width: "100%", ...sx }}
    >
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon fontSize="inherit" />}
        sx={{
          width: "fit-content",
          maxWidth: "600px",
          p: 2,
          borderRadius: "8px",
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}

export default ErrorMessage;
