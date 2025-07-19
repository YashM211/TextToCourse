// client/src/pages/LessonViewerPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import useApi from "../utils/api"; // Import your API hook
import LessonRenderer from "../components/LessonRenderer"; // Import the new renderer
import LoadingSpinner from '../components/LoadingSpinner'; // Import new component
import ErrorMessage from '../components/ErrorMessage'; // Import new component

function LessonViewerPage() {
  const  id  = useParams().lessonId; // Get the lesson ID from the URL
  const { callApi } = useApi();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(useParams());
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const data = await callApi(`/lesson/${id}`); // Assuming your backend has this route
        setLesson(data);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
        setError("Failed to load lesson content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    {console.log(`Lesson id triggerring`,id)}
    if (id) {
      fetchLesson();
    }
  }, [id, callApi]);

  if (loading) {
    return <LoadingSpinner message="Loading lesson content..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!lesson) {
    return (
      <Typography variant="h5" sx={{ mt: 4 }}>
        Lesson not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {lesson.title}
      </Typography>

      {/* Render the lesson content */}
      <LessonRenderer content={lesson.content} quiz={lesson.quiz} />

      {lesson.hinglishExplanation && (
        <Box
          sx={{
            mt: 4,
            p: 2,
            borderLeft: "4px solid #fbc02d",
            backgroundColor: "#fffde7",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Hinglish Explanation:
          </Typography>
          <Typography variant="body1">{lesson.hinglishExplanation}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default LessonViewerPage;
