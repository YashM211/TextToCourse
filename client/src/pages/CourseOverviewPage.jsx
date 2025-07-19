// client/src/pages/CourseOverviewPage.jsx (UPDATED)
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import useApi from "../utils/api";

function CourseOverviewPage() {
  const { courseId } = useParams(); // Get courseId from URL
  const { callApi } = useApi();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(courseId)
  useEffect(() => {
    console.log(courseId);
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ensure your backend's getCourseById populates modules and lessons
        const data = await callApi(`/course/${courseId}`);
        console.log("data : ",data);
        setCourse(data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError(
          "Failed to load course content. Please ensure you are logged in and the course exists."
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
      console.log(course);
    }

  }, [courseId, callApi]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading course...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!course) {
    return (
      <Typography variant="h5" sx={{ mt: 4 }}>
        Course not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {course.title}
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        {course.description}
      </Typography>

      {course.modules && course.modules.length > 0 ? (
        course.modules.map((module, moduleIndex) => (
          <Accordion
            key={module._id || moduleIndex}
            defaultExpanded={true}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{module.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {module.lessons && module.lessons.length > 0 ? (
                <List>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <ListItem
                      key={lesson._id || lessonIndex}
                      secondaryAction={
                        <Button
                          component={RouterLink}
                          to={`/courses/${courseId}/modules/${module._id}/lessons/${lesson._id}`}
                          variant="contained"
                          size="small"
                          startIcon={<PlayArrowIcon />}
                        >
                          Start Lesson
                        </Button>
                      }
                      sx={{
                        borderBottom: "1px solid #eee",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <ListItemText
                        primary={`Lesson ${moduleIndex + 1}.${
                          lessonIndex + 1
                        }: ${lesson.title}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No lessons in this module.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No modules found for this course.
        </Typography>
      )}
    </Box>
  );
}

export default CourseOverviewPage;
