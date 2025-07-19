// server/controllers/courseController.js (UPDATED FOR NORMALIZED SCHEMA)
import Course from "../models/Course.js";
import Module from "../models/Module.js"; // New import
import Lesson from "../models/Lesson.js"; // New import
// import { generateCourseContentWithAI } from '../services/aiService.js'; // Will integrate in Milestone 6

const generateCourse = async (req, res) => {
  const { topic } = req.body;
  const creator = req.userId; // Auth0 user ID from middleware

  if (!creator) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!topic) {
    return res
      .status(400)
      .json({ message: "Topic is required to generate a course." });
  }

  try {
    // TODO: In Milestone 6, call the AI service here to get the structured data
    // const aiGeneratedCourseData = await generateCourseContentWithAI(topic);

    // --- Dummy Data for Normalized Structure (simulating AI output) ---
    const dummyAIGeneratedData = {
      title: `Introduction to ${topic}`,
      description: `This course covers the fundamentals of ${topic}, from basic concepts to advanced applications.`,
      tags: [
        topic.toLowerCase().replace(/\s/g, "-"),
        "learning",
        "ai-generated",
      ],
      modules: [
        {
          moduleTitle: `Module 1: Foundations of ${topic}`,
          lessons: [
            {
              lessonTitle: `Lesson 1.1: What is ${topic}?`,
              content: [
                {
                  type: "paragraph",
                  value: `This lesson introduces the core concepts and history of ${topic}.`,
                },
                {
                  type: "paragraph",
                  value: `It's crucial to understand the basics before moving forward.`,
                },
              ],
              objectives: [`Define ${topic}`, `Understand its origins`],
              keyTopics: [`Definition`, `Historical Context`],
              resources: [`https://example.com/intro-to-${topic}`],
              quiz: {
                questions: [
                  {
                    questionText: `Which of the following best defines ${topic}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctAnswer: "Option B",
                    explanation:
                      "The correct option captures the essence of the topic.",
                  },
                ],
              },
            },
            {
              lessonTitle: `Lesson 1.2: Key Principles`,
              content: [
                {
                  type: "paragraph",
                  value: `Explore the fundamental principles that govern ${topic}.`,
                },
              ],
              objectives: [`Identify key principles`, `Apply basic rules`],
              keyTopics: [`Principle 1`, `Principle 2`],
              resources: [`https://example.com/principles-of-${topic}`],
            },
          ],
        },
        {
          moduleTitle: `Module 2: Advanced ${topic} Concepts`,
          lessons: [
            {
              lessonTitle: `Lesson 2.1: Advanced Topics`,
              content: [
                {
                  type: "paragraph",
                  value: `Dive deeper into complex aspects of ${topic}.`,
                },
              ],
              objectives: [`Analyze advanced theories`],
              keyTopics: [`Advanced Theory`],
              resources: [`https://example.com/advanced-${topic}`],
            },
          ],
        },
      ],
    };
    // --- End Dummy Data ---

    // 1. Create the Course document first
    const newCourse = new Course({
      title: dummyAIGeneratedData.title,
      description: dummyAIGeneratedData.description,
      creator: creator, // Use Auth0 user ID
      prompt: topic,
      tags: dummyAIGeneratedData.tags,
      modules: [], // Will populate with IDs later
    });
    await newCourse.save();

    // 2. Iterate through AI-generated modules, create Module documents, and link them
    const moduleIds = [];
    for (const modData of dummyAIGeneratedData.modules) {
      const newModule = new Module({
        title: modData.moduleTitle,
        course: newCourse._id, // Link to the created Course
        lessons: [], // Will populate with IDs later
      });
      await newModule.save();
      moduleIds.push(newModule._id);

      // 3. Iterate through AI-generated lessons, create Lesson documents, and link them
      const lessonIds = [];
      for (const lesData of modData.lessons) {
        const newLesson = new Lesson({
          title: lesData.lessonTitle,
          content: lesData.content,
          isEnriched: lesData.isEnriched || false,
          hinglishExplanation: lesData.hinglishExplanation,
          quiz: lesData.quiz,
          module: newModule._id, // Link to the created Module
        });
        await newLesson.save();
        lessonIds.push(newLesson._id);
      }
      // Update the Module with its new Lesson IDs
      newModule.lessons = lessonIds;
      await newModule.save();
    }
    // Update the Course with its new Module IDs
    newCourse.modules = moduleIds;
    await newCourse.save();

    res.status(201).json(newCourse); // Send back the complete course (with populated IDs)
  } catch (error) {
    console.error("Error generating course:", error);
    res
      .status(500)
      .json({ message: "Error generating course", error: error.message });
  }
};

// server/controllers/courseController.js (getCourseById function)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
        }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optional: Only allow owner to view (if req.userId is available from Auth0)
    if (course.creator && req.userId && course.creator !== req.userId) {
       return res.status(403).json({ message: 'Access denied: You do not own this course.' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id); // Assuming Lesson is imported
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }
    res.status(200).json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res
      .status(500)
      .json({ message: "Error fetching lesson", error: error.message });
  }
};

export { generateCourse, getCourseById, getLessonById };
