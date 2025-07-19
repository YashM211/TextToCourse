// server/models/Course.js (UPDATED FOR NORMALIZED DESIGN)
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      // This will store the Auth0 `sub` (user ID)
      type: String,
      required: true,
    },
    modules: [
      {
        // Array of references to child Modules
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    prompt: {
      // The original user prompt
      type: String,
      required: true,
    },
    tags: [
      {
        // Good addition for categorization and search
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt

const Course = mongoose.model("Course", courseSchema);

export default Course;
