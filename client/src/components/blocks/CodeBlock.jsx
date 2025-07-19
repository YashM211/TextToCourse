// client/src/components/blocks/CodeBlock.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ language, text }) {
  return (
    <Box
      sx={{
        backgroundColor: "#272727",
        color: "#f8f8f2",
        padding: "1em",
        borderRadius: "8px",
        overflowX: "auto",
        my: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: "#aaa", display: "block", mb: 1 }}
      >
        {language || "plaintext"}
      </Typography>
      <pre
        style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        <code>{text}</code>
      </pre>
      {/* For syntax highlighting: */}
      {/* <SyntaxHighlighter language={language || 'text'} style={dark}>
        {text}
      </SyntaxHighlighter> */}
    </Box>
  );
}

export default CodeBlock;
