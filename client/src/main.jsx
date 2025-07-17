// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // Helps with consistent styling
import App from "./App.jsx";
import theme from "./theme.js"; // We'll create this file
import "./index.css"; // Global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Applies a consistent baseline CSS */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
