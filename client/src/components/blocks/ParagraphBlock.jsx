// client/src/components/blocks/ParagraphBlock.jsx
import React from "react";
import { Typography } from "@mui/material";

function ParagraphBlock({ text }) {
  return (
    <Typography variant="body1" paragraph>
      {text}
    </Typography>
  );
}

export default ParagraphBlock;
