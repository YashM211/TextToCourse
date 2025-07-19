// server/services/aiService.js (UPDATED)
import axios from "axios";

const AI_API_KEY = process.env.AI_API_KEY;
const AI_ENDPOINT = process.env.AI_ENDPOINT;

// Helper function to clean AI's Markdown-wrapped JSON
const cleanJsonResponse = (jsonString) => {
  // Remove leading and trailing markdown code block delimiters
  let cleanedString = jsonString.trim();
  if (cleanedString.startsWith("```json")) {
    cleanedString = cleanedString.substring(7); // Remove '```json'
  }
  if (cleanedString.endsWith("```")) {
    cleanedString = cleanedString.substring(0, cleanedString.length - 3); // Remove '```'
  }
  return cleanedString.trim();
};

const generateCourseOutlineWithAI = async (topic) => {
  const prompt = `You are an expert educational content generator specializing in creating comprehensive course outlines.
Your task is to generate a course outline in strict JSON format based on the user's provided topic.

**Rules:**
1.  The course should be comprehensive, covering foundational to advanced concepts for the given topic.
2.  Generate between 3 and 6 modules.
3.  Each module should contain between 3 and 5 lessons.
4.  The output must be **raw JSON only**, without any surrounding markdown (\`\`\`json) or explanatory text.

**JSON Output Format Specification:**
{
  "title": "<Concise and informative course title>",
  "description": "<A compelling and accurate course description (2-4 sentences)>",
  "tags": ["<relevant-tag-1>", "<relevant-tag-2>", "<relevant-tag-3>"], // At least 3 lower-case, hyphenated tags
  "modules": [
    {
      "moduleTitle": "<Clear and descriptive module title>",
      "lessons": [
        {"lessonTitle": "<Specific and engaging lesson title>"},
        // ... 3 to 5 lesson titles per module
      ]
    },
    // ... 3 to 6 modules
  ]
}

**Topic:** ${topic}`;

  try {
    const response = await axios.post(
      AI_ENDPOINT,
      {
        contents: [{ parts: [{ text: prompt }] }],
        // For Gemini, consider adding these if available for better JSON adherence:
        // generationConfig: {
        //     responseMimeType: "application/json",
        //     temperature: 0.7,
        //     maxOutputTokens: 2048,
        // }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": AI_API_KEY,
        },
      }
    );

    const rawJsonResponse = response.data.candidates[0].content.parts[0].text;
    // Clean the response before parsing
    const cleanedJsonResponse = cleanJsonResponse(rawJsonResponse);
    console.log("AI Raw Response (before clean):", rawJsonResponse); // For debugging
    console.log("AI Cleaned Response (before parse):", cleanedJsonResponse); // For debugging
    return JSON.parse(cleanedJsonResponse);
  } catch (error) {
    console.error(
      "Error calling AI for course outline:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate course outline from AI.");
  }
};

const generateLessonContentWithAI = async (
  courseTitle,
  moduleTitle,
  lessonTitle
) => {
  const prompt = `You are an expert educational content generator specializing in creating detailed, rich, and interactive lesson content.
Your task is to generate the full content for a single lesson in strict JSON format.

**Context:**
Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

**Rules:**
1.  The output must be **raw JSON only**, without any surrounding markdown (\`\`\`json) or explanatory text.
2.  The "title" field in the output JSON must exactly match the provided "Lesson" title.
3.  Include 2-4 clear, measurable learning objectives using action verbs (e.g., "Understand X", "Identify Y").
4.  The "content" array should include a mix of "heading", "paragraph", "code", and "video" block types to comprehensively cover the lesson.
5.  Include at least one "heading" and multiple "paragraph" blocks.
6.  A "code" block should be included only if directly relevant to the lesson's technical content. Specify the \`language\` (e.g., "python", "javascript", "java").
7.  A "video" block should contain a **descriptive Youtube query** in the \`url\` field and a \`description\` for the content of the video. DO NOT provide direct YouTube links. (Example: \`"url": "introduction to machine learning for beginners youtube"\`).
8.  At the very end of the lesson content, generate a \`quiz\` object containing 4-5 diverse multiple-choice questions (MCQs) related to the lesson.
9.  Each MCQ must have a \`questionText\`, an array of \`options\` (at least 4), a \`correctAnswer\` (which must be one of the \`options\`), and a detailed \`explanation\`.
10. If applicable and requested, provide a concise "hinglishExplanation" summarising the lesson content. If not, omit the field or leave it empty.

**JSON Output Format Specification:**
{
  "title": "${lessonTitle}",
  "objectives": [
    "<Objective 1>",
    "<Objective 2>"
    // ... 2-4 objectives
  ],
  "content": [
    { "type": "heading", "text": "<Main Section Heading>" },
    { "type": "paragraph", "text": "<Paragraph text>" },
    // Optional: { "type": "code", "language": "python", "text": "print('Example Code')" },
    // Optional: { "type": "video", "url": "Youtube query (e.g., 'Python basics for beginners youtube')", "description": "Short description of video content" },
    // ... mix of content blocks
  ],
  "hinglishExplanation": "<Optional concise Hinglish summary>",
  "quiz": {
    "questions": [
      {
        "questionText": "<Question 1 Text>",
        "options": ["<Option A>", "<Option B>", "<Option C>", "<Option D>"],
        "correctAnswer": "<Correct Option Text>",
        "explanation": "<Detailed explanation for the correct answer>"
      }
      // ... 4-5 questions
    ]
  }
}
`;

  try {
    const response = await axios.post(
      AI_ENDPOINT,
      {
        contents: [{ parts: [{ text: prompt }] }],
        // generationConfig: {
        //     responseMimeType: "application/json",
        //     temperature: 0.7,
        //     maxOutputTokens: 2048,
        // }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": AI_API_KEY,
        },
      }
    );

    const rawJsonResponse = response.data.candidates[0].content.parts[0].text;
    // Clean the response before parsing
    const cleanedJsonResponse = cleanJsonResponse(rawJsonResponse);
    console.log("AI Raw Response (before clean):", rawJsonResponse); // For debugging
    console.log("AI Cleaned Response (before parse):", cleanedJsonResponse); // For debugging
    return JSON.parse(cleanedJsonResponse);
  } catch (error) {
    console.error(
      "Error calling AI for lesson content:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate lesson content from AI.");
  }
};

export { generateCourseOutlineWithAI, generateLessonContentWithAI };
