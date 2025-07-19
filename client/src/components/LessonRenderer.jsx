// client/src/components/LessonRenderer.jsx
import React from "react";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
// import VideoBlock from "./blocks/VideoBlock"; // Remove this line if it existed
import VideoBlock from "./VideoBlock"; // <--- UPDATED IMPORT PATH for the new VideoBlock
import MCQBlock from "./blocks/MCQBlock";
import { Box, Typography, Alert, Divider } from "@mui/material"; // Added Divider and Alert for completeness

const blockComponents = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock, // Ensure this points to the new VideoBlock, which will handle the query prop
  // 'mcq' type blocks are handled separately below, if you want them within 'content' array.
  // Currently, your quiz is rendered from the separate 'quiz' prop.
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
          // For the video block, ensure the 'url' from AI becomes 'query' for VideoBlock
          if (block.type === "video") {
            return (
              <BlockComponent
                key={index}
                query={block.url} // Pass block.url as 'query' to the new VideoBlock
                description={block.description} // Pass description if your VideoBlock uses it
              />
            );
          }
          // For other block types, spread all properties
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
          <Divider sx={{ mb: 3 }} />{" "}
          {/* Added a Divider for visual separation */}
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
