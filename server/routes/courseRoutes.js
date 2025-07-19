// server/routes/courseRoutes.js
import express from "express";
import {
  generateCourse,
  getCourseById,
  getLessonById,
  getUserCourses,
} from "../controllers/courseControllers.js"; // Will create these

const router = express.Router();

// The checkJwt and attachUserToReq middleware are applied in server.js
// so these routes are already protected.
router.post("/generate-course", generateCourse);
router.get("/course/:id", getCourseById);
router.get('/lesson/:id', getLessonById); // New route
 router.get('/my-courses', getUserCourses);

export default router;
