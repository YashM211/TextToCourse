// server/routes/youtubeRoutes.js
import express from "express";
import { searchYoutubeVideos } from "../controllers/youtubeController.js";

const router = express.Router();

router.get("/youtube", searchYoutubeVideos); // New route for Youtube

export default router;
