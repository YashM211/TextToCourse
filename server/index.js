// server/server.js (UPDATED)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import { checkJwt, attachUserToReq } from "./middlewares/auth0.js"; // Import Auth0 middleware

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDb();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS

// Basic public route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Example of a PUBLIC route
app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public endpoint. Anyone can access it!" });
});

// Example of a PROTECTED route
// These routes will require a valid Auth0 Access Token
app.get("/api/private", checkJwt, (req, res) => {
  res.json({
    message:
      "This is a private endpoint. Only authenticated users can access it!",
  });
});

// Import and use actual API routes (for course generation)
import courseRoutes from "./routes/courseRoutes.js";
app.use("/api", checkJwt, attachUserToReq, courseRoutes); // Apply protection to all course routes

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
