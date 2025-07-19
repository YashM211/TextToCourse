// server/controllers/youtubeController.js
import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

const searchYoutubeVideos = async (req, res) => {
  const { query } = req.query; // Get the search query from frontend
  const maxResults = req.query.maxResults || 1; // Default to 1 result

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  if (!YOUTUBE_API_KEY) {
    console.error("YouTube API key is not set in environment variables.");
    return res
      .status(500)
      .json({
        message: "Server configuration error: YouTube API key missing.",
      });
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        q: query,
        part: "snippet", // Request snippet for video details
        type: "video", // Only search for videos
        maxResults: maxResults,
        videoEmbeddable: "true", // Ensure videos can be embedded
        // order: 'relevance', // Or 'viewCount', 'rating', 'date'
      },
    });

    const videos = response.data.items;

    if (videos && videos.length > 0) {
      // Return the first video's ID or relevant details
      const topVideo = videos[0];
      const videoId = topVideo.id.videoId;
      const title = topVideo.snippet.title;
      const thumbnailUrl = topVideo.snippet.thumbnails.default.url; // Or 'high', 'medium'

      res.status(200).json({
        videoId: videoId,
        title: title,
        thumbnailUrl: thumbnailUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      });
    } else {
      res
        .status(404)
        .json({ message: "No relevant videos found for the query." });
    }
  } catch (error) {
    console.error(
      "Error searching YouTube videos:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        message: "Failed to search YouTube videos.",
        error: error.message,
      });
  }
};

export { searchYoutubeVideos };
