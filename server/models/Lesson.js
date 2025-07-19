// server/models/Lesson.js
import mongoose from "mongoose";

// Define quizQuestionSchema directly here as it's tightly coupled to a lesson's quiz
const quizQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

// The actual Lesson Schema
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // Flexible content array for structured blocks (e.g., paragraphs, code, images, videos)
    // This will be crucial for the "Rich Lessons" feature in Milestone 6
    content: {
      type: [mongoose.Schema.Types.Mixed], // Allows for varied content structures
      required: true,
      default: [], // Ensure it's an array by default
    },
    isEnriched: {
      // To track if AI-enhanced
      type: Boolean,
      default: false,
    },
    // Optional: A field for Hinglish explanation, if not part of main content blocks
    hinglishExplanation: {
      type: String,
      required: false,
    },
    quiz: {
      // Quiz for this specific lesson
      questions: [quizQuestionSchema],
      default: [], // Prevents empty quiz object if no questions
    },
    module: {
      // Reference to its parent Module
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
