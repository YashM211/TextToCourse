// client/src/components/LessonRenderer.jsx
import React from "react";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";
import { Box, Typography } from "@mui/material";

const blockComponents = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock,
  mcq: MCQBlock, // We'll manage MCQ here directly or pass to MCQBlock
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
          return <BlockComponent key={index} {...block} />;
        }
        console.warn(`Unknown block type: ${block.type}`);
        return (
          <Alert key={index} severity="warning">
            Unsupported content type: {block.type}
          </Alert>
        );
      })}

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
