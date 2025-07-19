// client/src/components/VideoBlock.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import useApi from "../utils/api"; // Assuming useApi is your authenticated fetch hook

function VideoBlock({ query, description }) {
  const { callApi } = useApi();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!query) {
        setError("No video search query provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Make backend API call to search YouTube
        // Use encodeURIComponent to handle special characters in the query
        const data = await callApi(
          `/youtube?query=${encodeURIComponent(query)}&maxResults=1`
        );
        setVideoData(data);
      } catch (err) {
        console.error("Failed to fetch YouTube video:", err);
        setError(
          err.message || "Failed to load video. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [query, callApi]); // Re-run if query or callApi changes

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "150px",
        }}
      >
        <CircularProgress size={24} />
        <Typography sx={{ ml: 1 }}>Loading video...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!videoData || !videoData.embedUrl) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No video found for "{query}".
      </Alert>
    );
  }

  // Render the YouTube iframe
  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {description || `Related Video: ${videoData.title}`}
      </Typography>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9 aspect ratio (height / width * 100)
          height: 0,
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        <iframe
          src={videoData.embedUrl}
          title={videoData.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        ></iframe>
      </Box>
    </Box>
  );
}

export default VideoBlock;
