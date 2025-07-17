// client/src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Example blue color
    },
    secondary: {
      main: "#dc004e", // Example pink color
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      marginBottom: "1rem",
    },
    // Add more typography customizations as needed
  },
  // You can add more customizations here (components, breakpoints, etc.)
});

export default theme;
