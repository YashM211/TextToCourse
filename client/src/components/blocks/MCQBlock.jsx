// client/src/components/blocks/MCQBlock.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

function MCQBlock({ question, questionNumber }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption === question.correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption("");
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <Box
      sx={{
        my: 3,
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6" component="h3" gutterBottom>
        Question {questionNumber}: {question.questionText}
      </Typography>
      <RadioGroup value={selectedOption} onChange={handleChange}>
        {question.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
            disabled={submitted} // Disable options after submission
          />
        ))}
      </RadioGroup>

      {!submitted && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!selectedOption} // Disable if no option selected
          sx={{ mt: 2 }}
        >
          Check Answer
        </Button>
      )}

      {submitted && (
        <Box sx={{ mt: 2 }}>
          {isCorrect ? (
            <Alert
              severity="success"
              icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            >
              Correct!
            </Alert>
          ) : (
            <Alert
              severity="error"
              icon={<CancelOutlinedIcon fontSize="inherit" />}
            >
              Incorrect. The correct answer was: **{question.correctAnswer}**
            </Alert>
          )}
          <Typography
            variant="body2"
            sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
          >
            **Explanation:** {question.explanation}
          </Typography>
          <Button variant="outlined" onClick={handleReset} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default MCQBlock;
