// client/src/components/LessonRenderer.jsx
import React from "react";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./VideoBlock"; // Correct path for the new VideoBlock
import MCQBlock from "./blocks/MCQBlock";
import { Box, Typography, Alert, Divider } from "@mui/material";

// Map block types to their respective components
const blockComponents = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock,
  // 'mcq' type is handled directly in the quiz section below or by MCQBlock if part of quiz prop
};

function LessonRenderer({ content, quiz }) {
  if (!content || content.length === 0) {
    return (
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        No content available for this lesson.
      </Typography>
    );
  }

  return (
    <Box>
      {content.map((block, index) => {
        const BlockComponent = blockComponents[block.type];
        if (BlockComponent) {
          // Special handling for video blocks: map 'url' from AI to 'query' prop
          if (block.type === "video") {
            return (
              <BlockComponent
                key={index}
                query={block.url} // AI provides search query in 'url' field
                description={block.description}
              />
            );
          }
          // For other block types, spread all properties
          return <BlockComponent key={index} {...block} />;
        }
        // Warn for unsupported block types
        console.warn(
          `Unknown block type encountered in LessonRenderer: ${block.type}`
        );
        return (
          <Alert key={index} severity="warning">
            Unsupported content type: {block.type}
          </Alert>
        );
      })}

      {/* Render Quiz section only if quiz data is provided and has questions */}
      {/* This allows LessonPDFExporter to pass quiz={null} to prevent duplicate rendering */}
      {quiz && quiz.questions && quiz.questions.length > 0 && (
        <Box
          sx={{
            mt: 5,
            p: 3,
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Quiz Time! 🤔
          </Typography>
          {quiz.questions.map((question, index) => (
            <MCQBlock
              key={`quiz-${index}`}
              question={question}
              questionNumber={index + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default LessonRenderer;
