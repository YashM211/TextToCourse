// client/src/components/blocks/VideoBlock.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

function VideoBlock({ url, description }) {
  // Added description for clarity from AI
  // Simple check for YouTube URL for embedding
  const isYouTube =
    url && (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/"));
  const youtubeId = isYouTube
    ? new URLSearchParams(new URL(url).search).get("v") || url.split("/").pop()
    : null;

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        Video Reference:
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {description}
        </Typography>
      )}

      {isYouTube && youtubeId ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            height: 0,
            "& iframe": {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            },
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </Box>
      ) : (
        <Button
          variant="outlined"
          startIcon={<PlayCircleOutlineIcon />}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!url || url.trim() === "" || url === "Video Not Found"} // Disable if no valid URL
        >
          {url && url.trim() !== "" && url !== "Video Not Found"
            ? `Watch: ${url.length > 50 ? url.substring(0, 47) + "..." : url}`
            : "Video Link Not Available"}
        </Button>
      )}
      {!url ||
        url.trim() === "" ||
        (url === "Video Not Found" && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            (AI could not find a specific video link, try searching for the
            description above)
          </Typography>
        ))}
    </Box>
  );
}

export default VideoBlock;
