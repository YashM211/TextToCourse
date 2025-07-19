// server/models/Module.js
import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      // Reference to its parent Course
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessons: [
      {
        // Array of references to its child Lessons
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt

const Module = mongoose.model("Module", moduleSchema);

export default Module;
