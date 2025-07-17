// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js"
// const connectDB = require("./config/db"); // Import the DB connection function

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDb();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
