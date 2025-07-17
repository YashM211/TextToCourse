// server/models/Course.js
import mongoose from "mongoose"; // Changed from require to import

// ----------------------------------------------------
// Schema for quiz questions (nested within lessons)
// ----------------------------------------------------
const quizQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      // Array of strings for the answer options (e.g., ["Option A", "Option B", "Option C", "Option D"])
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    // The text of the correct option (e.g., "Option B")
    type: String,
    required: true,
  },
  explanation: {
    // Detailed explanation for why the correctAnswer is correct
    type: String,
    required: true,
  },
});

// ----------------------------------------------------
// Schema for individual lessons (updated to include quiz)
// ----------------------------------------------------
const lessonSchema = new mongoose.Schema({
  lessonTitle: {
    type: String,
    required: true,
  },
  objectives: [
    {
      // Array of strings for learning objectives
      type: String,
    },
  ],
  keyTopics: [
    {
      // Array of strings for key topics covered in the lesson
      type: String,
    },
  ],
  resources: [
    {
      // Array of strings for suggested readings or external links (URLs, book titles, video keywords)
      type: String,
    },
  ],
  hinglishExplanation: {
    // Optional: A field for Hinglish explanation for this specific lesson
    type: String,
    required: false, // Not all lessons might have this
  },
  quiz: {
    // NEW LOCATION: Quiz field moved here
    questions: [quizQuestionSchema], // Array of quizQuestion subdocuments
    default: undefined, // Explicitly set to undefined if no quiz is generated to prevent empty object in DB
  },
});

// ----------------------------------------------------
// Schema for modules (now only contains lessons, no direct quiz field)
// ----------------------------------------------------
const moduleSchema = new mongoose.Schema({
  moduleTitle: {
    type: String,
    required: true,
  },
  lessons: [lessonSchema], // Array of lesson subdocuments
});

// ----------------------------------------------------
// Main Course Schema
// ----------------------------------------------------
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  modules: [moduleSchema], // Array of module subdocuments
  prompt: {
    // Store the original user prompt for reference and potential re-generation/debugging
    type: String,
    required: true,
  },
  userId: {
    // To link courses to users (for persistent courses feature later with Auth0)
    type: String,
    required: false, // Set to true once Auth0 integration is live and user IDs are available
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ----------------------------------------------------
// Create and Export the Mongoose Model
// ----------------------------------------------------
const Course = mongoose.model("Course", courseSchema);

export default Course; // Changed from module.exports to export default
