// client/src/pages/LessonViewerPage.jsx (Symmetry Improvement)
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  CircularProgress,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import useApi from "../utils/api";
import LessonRenderer from "../components/LessonRenderer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import LessonPDFExporter from "../components/LessonPDFExporter";

function LessonViewerPage() {
  const { courseId, moduleId, lessonId } = useParams();
  const { callApi } = useApi();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchLessonAndContext = async () => {
      try {
        setLoading(true);
        setError(null);

        const lessonData = await callApi(`/lesson/${lessonId}`);
        setLesson(lessonData);

        const courseData = await callApi(`/course/${courseId}`);
        setCourseTitle(courseData.title);

        const moduleData = courseData.modules.find((m) => m._id === moduleId);
        if (moduleData) {
          setModuleTitle(moduleData.title);
        }
      } catch (err) {
        console.error("Failed to fetch lesson or course context:", err);
        setError(
          err.message ||
            "Failed to load lesson content. Please ensure you are logged in and the lesson exists."
        );
      } finally {
        setLoading(false);
      }
    };

    if (lessonId && courseId && moduleId) {
      fetchLessonAndContext();
    }
  }, [lessonId, courseId, moduleId, callApi]);

  const extractLessonText = (contentBlocks) => {
    if (!contentBlocks) return "";
    return contentBlocks
      .filter((block) => block.type === "paragraph" || block.type === "heading")
      .map((block) => block.text)
      .join("\n");
  };

  const handlePlayHinglishExplanation = async () => {
    // ... (Your existing Hinglish audio logic) ...
  };

  const handleAudioEnded = () => {
    // ... (Your existing audio end logic) ...
  };

  const handleToggleAudio = () => {
    // ... (Your existing audio toggle logic) ...
  };

  if (loading) {
    return <LoadingSpinner message="Loading lesson..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!lesson) {
    return <Typography variant="h6">Lesson not found.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/my-courses"
        >
          My Courses
        </Link>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={`/courses/${courseId}`}
        >
          {courseTitle || "Course"}
        </Link>
        {/* <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={`/courses/${courseId}}`}
        >
          {moduleTitle || "Module"}
        </Link> */}
        <Typography color="inherit">{moduleTitle}</Typography>
        <Typography color="text.primary">{lesson.title}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        {lesson.title}
      </Typography>

      {/* Lesson Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <Box
          sx={{
            mb: 3,
            borderLeft: "4px solid #1976d2",
            // Removed 'pl: 2' here. Padding should be handled by the Container or inner elements if needed.
            py: 1,
            backgroundColor: "#e3f2fd",
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            Learning Objectives:
          </Typography>
          {/* Apply left padding to the UL directly inside the box if needed for list indentation */}
          <ul style={{ margin: 0, paddingLeft: "2em" }}>
            {lesson.objectives.map((obj, idx) => (
              <li key={idx}>
                <Typography variant="body1">{obj}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}

      {/* PDF Exporter Component */}
      <LessonPDFExporter
        lesson={lesson}
        courseTitle={courseTitle}
        moduleTitle={moduleTitle}
      />

      <LessonRenderer content={lesson.content} quiz={lesson.quiz} />
    </Container>
  );
}

export default LessonViewerPage;
