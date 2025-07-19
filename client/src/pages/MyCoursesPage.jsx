// client/src/pages/MyCoursesPage.jsx
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useApi from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function MyCoursesPage() {
  const { callApi } = useApi();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await callApi("/my-courses"); // Call the new backend endpoint
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch my courses:", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [callApi]);

  if (loading) {
    return <LoadingSpinner message="Loading your courses..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Courses
      </Typography>

      {courses && courses.length > 0 ? (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {courses.map((course, index) => (
            <React.Fragment key={course._id}>
              <ListItem
                alignItems="flex-start"
                sx={{ py: 2 }}
                secondaryAction={
                  <Button
                    component={RouterLink}
                    to={`/courses/${course._id}`}
                    variant="contained"
                    size="small"
                  >
                    View Course
                  </Button>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {course.title}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {course.description}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {course.modules.length} Modules | Created:{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < courses.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't generated any courses yet.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 2 }}
          >
            Generate Your First Course
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default MyCoursesPage;
