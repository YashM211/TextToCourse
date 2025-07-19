// server/models/Lesson.js
import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Array of mixed types for blocks
      default: [],
    },
    objectives: {
      // NEW FIELD
      type: [String],
      default: [],
    },
    hinglishExplanation: {
      type: String,
      default: "",
    },
    quiz: {
      type: mongoose.Schema.Types.Mixed, // Object for quiz questions
      default: {},
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    isEnriched: {
      // NEW FIELD: false initially, true after content generation
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

export default Lesson;
