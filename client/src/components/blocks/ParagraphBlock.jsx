// client/src/components/blocks/ParagraphBlock.jsx
import React from "react";
import { Typography } from "@mui/material";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

function ParagraphBlock({ text }) {
  return (
    // Use component="div" to avoid nesting <p> tags inside Typography's default <p>,
    // which ReactMarkdown will render
    <Typography variant="body1" component="div" sx={{ mb: 2 }}>
      <ReactMarkdown>{text}</ReactMarkdown>{" "}
      {/* Use ReactMarkdown to render the text */}
    </Typography>
  );
}

export default ParagraphBlock;
