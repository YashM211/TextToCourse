// client/src/main.jsx (UPDATED)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import theme from "./theme.js";
import "./index.css";
import { Analytics } from "@vercel/analytics/next";

// AUTH0 IMPORTS
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Auth0Provider Wrapper */}
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Your API Identifier
          scope: "openid profile email", // Request basic user info
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <Analytics/>
        </ThemeProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
