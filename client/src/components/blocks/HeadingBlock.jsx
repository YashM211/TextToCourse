// client/src/components/blocks/HeadingBlock.jsx
import React from "react";
import { Typography } from "@mui/material";

function HeadingBlock({ text }) {
  // You might want to map different heading levels (h1, h2, h3) based on block.level if AI provides it
  return (
    <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3, mb: 1 }}>
      {text}
    </Typography>
  );
}

export default HeadingBlock;
