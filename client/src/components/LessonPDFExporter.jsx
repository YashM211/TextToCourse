// client/src/components/LessonPDFExporter.jsx (FINAL OPTIMIZATION)
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import LessonRenderer from "./LessonRenderer";

function LessonPDFExporter({ lesson, courseTitle, moduleTitle }) {
  const printRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const DPI = 200; // Increased DPI to 200 for better clarity, still reasonable file size
  const PX_PER_MM = DPI / 25.4; // Pixels per millimeter
  const handleDownloadPdf = async () => {
    if (!lesson) {
      setError("Lesson content not available for PDF export.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const originalScrollY = window.scrollY; // Store original scroll position

    try {
      // Give React a moment to render the content into the hidden div
      // Increased timeout significantly to ensure all content (especially images/videos) are rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!printRef.current) {
        throw new Error("PDF content reference not found after rendering.");
      }

      const element = printRef.current;
      element.scrollTop = 0; // Ensure hidden element is scrolled to top

    //   // Define A4 dimensions for PDF and desired DPI
    //   const A4_WIDTH_MM = 210;
    //   const A4_HEIGHT_MM = 297;
    //   const DPI = 200; // Increased DPI to 200 for better clarity, still reasonable file size
    //   const PX_PER_MM = DPI / 25.4; // Pixels per millimeter

      const captureWidthPx = A4_WIDTH_MM * PX_PER_MM; // Full A4 width in pixels
      // html2canvas should capture the *actual scroll height* of the content
      const captureHeightPx = element.scrollHeight; // Capture the full actual height of the content

      const canvas = await html2canvas(element, {
        scale: DPI / 96, // Scale factor to render from browser's DPI (96) to target DPI (200)
        useCORS: true,
        logging: false,
        width: captureWidthPx, // Tell html2canvas to render to this exact width
        windowWidth: captureWidthPx,
        height: captureHeightPx, // Use actual scroll height for capture
        windowHeight: captureHeightPx, // Use actual scroll height for capture window
        x: 0,
        y: 0,
        backgroundColor: "#ffffff", // Ensure white background
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.9); // Use higher quality 0.9
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = canvas.width; // Actual pixel width of captured canvas
      const imgHeight = canvas.height; // Actual pixel height of captured canvas (could be very long)

      // Calculate the total height of the image when scaled to fit the PDF page width
      const pdfPageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const scaleFactor = pdfPageWidth / imgWidth; // How much to scale imgWidth to fit pdfPageWidth
      const totalImgHeightScaledToPdf = imgHeight * scaleFactor; // Total height of the image if rendered on PDF at this scale

      let heightLeft = totalImgHeightScaledToPdf; // Remaining height to render (in mm)
      let position = 0; // Current Y position of the image on the PDF page (in mm)

      // Add the first page of the image
      // jsPDF adds one page by default, so we can directly add to it.
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        pdfPageWidth,
        totalImgHeightScaledToPdf
      );
      heightLeft -= pdfPageHeight;

      // Add subsequent pages if content is longer than one page
      while (heightLeft >= -1) {
        // Use -1 to account for slight floating point inaccuracies for the last page
        position = position - pdfPageHeight; // Move the image UP (negative Y) for the next page
        pdf.addPage(); // Add a new blank page
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          position,
          pdfPageWidth,
          totalImgHeightScaledToPdf
        );
        heightLeft -= pdfPageHeight;
      }

      pdf.save(`${lesson.title}_Lesson.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError(`Failed to generate PDF: ${err.message || "Unknown error"}`);
    } finally {
      setIsGenerating(false);
      window.scrollTo(0, originalScrollY); // Restore scroll position
    }
  };

  const getPrintableQuiz = (quiz) => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;
    return (
      <Box className="quiz-section-for-pdf">
        <Typography variant="h5" component="h2" gutterBottom>
          Quiz Time! 🤔
        </Typography>
        {quiz.questions.map((q, qIdx) => (
          <Box key={`q-${qIdx}`} className="quiz-question-for-pdf">
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {qIdx + 1}. {q.questionText}
            </Typography>
            <Box sx={{ ml: 2 }}>
              {q.options.map((option, oIdx) => (
                <Typography
                  key={`q-${qIdx}-o-${oIdx}`}
                  variant="body2"
                  className="quiz-option-for-pdf"
                >
                  {String.fromCharCode(65 + oIdx)}. {option}
                </Typography>
              ))}
            </Box>
            <Typography variant="body2" className="quiz-explanation-for-pdf">
              Correct Answer: {q.correctAnswer} <br />
              Explanation: {q.explanation}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  // Styles for the hidden print content - CRITICAL FOR LAYOUT
  const printStyles = {
    all: "initial", // Reset all inherited styles for a clean slate
    boxSizing: "border-box",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1.6,
    color: "#000",
    backgroundColor: "#fff",
    // Set the width and minHeight of this outer Box to be the *full A4 page dimensions in pixels*.
    // This element will be captured by html2canvas, so its internal padding will define margins.
    width: `${A4_WIDTH_MM * PX_PER_MM}px`, // Full A4 width in pixels at 200 DPI
    minHeight: `${A4_HEIGHT_MM * PX_PER_MM}px`, // Min A4 height in pixels at 200 DPI (for short content)
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
    zIndex: -1,
    overflow: "hidden", // Crucial to prevent scrollbars within the hidden element
    padding: "20mm 15mm", // Top/Bottom 20mm, Left/Right 15mm margins applied here

    // General styles for content (headings, paragraphs, lists, code, etc.)
    "& h1": {
      fontSize: "3rem",
      marginBottom: "0.5em",
      textAlign: "center",
      pageBreakAfter: "avoid",
    }, // For main lesson title in the PDF
    "& h2": {
      fontSize: "2.2rem",
      marginBottom: "0.5em",
      pageBreakAfter: "avoid",
    }, // For module title
    "& h3": {
      fontSize: "1.8rem",
      marginBottom: "0.5em",
      pageBreakAfter: "avoid",
    }, // For lesson title in PDF
    "& h4": {
      fontSize: "1.6rem",
      marginBottom: "0.5em",
      pageBreakAfter: "avoid",
    },
    "& h5": {
      fontSize: "1.4rem",
      marginBottom: "0.5em",
      pageBreakAfter: "avoid",
    },
    "& h6": {
      fontSize: "1.2rem",
      marginBottom: "0.5em",
      pageBreakAfter: "avoid",
    },

    // Core rule to prevent splitting for common block elements
    "& p, & ul, & ol, & li, & img, & pre, & blockquote, & figure": {
      pageBreakInside: "avoid",
    },

    "& p": {
      marginBottom: "1em",
      textAlign: "justify",
      fontSize: "1.05rem", // Slightly adjusted font size for readability
      lineHeight: 1.7,
      // pageBreakInside: "avoid" handled by common rule above
    },
    "& ul, & ol": {
      marginLeft: "2em",
      marginBottom: "1em",
      fontSize: "1.05rem", // Match paragraph font size
    },
    "& ul li, & ol li": {
      // Apply to individual list items
      marginBottom: "0.5em", // Add some spacing for readability
      // pageBreakInside: "avoid" handled by common rule above
    },
    "& pre": {
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "4px",
      overflowX: "auto",
      fontFamily: "monospace",
      fontSize: "1rem", // Larger font for code blocks
      color: "#333",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      // pageBreakInside: "avoid" handled by common rule above
    },
    "& code": {
      fontFamily: "monospace",
      backgroundColor: "#e0e0e0",
      padding: "2px 4px",
      borderRadius: "3px",
      fontSize: "1rem", // Larger font for inline code
    },
    ".quiz-section-for-pdf": {
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      padding: "20px",
      marginTop: "30px",
      pageBreakBefore: "always", // Force quiz to start on a new page
      fontSize: "1.05rem", // Set base font size for quiz section
    },
    ".quiz-question-for-pdf": {
      marginBottom: "15px",
      fontSize: "1.05rem", // Quiz question font size
      pageBreakInside: "avoid", // Keep entire quiz question together
    },
    ".quiz-option-for-pdf": {
      marginLeft: "20px",
      lineHeight: 1.7,
      fontSize: "1em", // Quiz option font size
    },
    ".quiz-explanation-for-pdf": {
      fontSize: "0.95em", // Slightly larger explanation font
      color: "#555",
      marginTop: "5px",
      fontStyle: "italic",
    },
    ".video-block-placeholder-for-pdf": {
      width: "100%",
      height: "150px",
      backgroundColor: "#f5f5f5",
      border: "1px dashed #ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "#777",
      fontSize: "1.1rem", // Larger font for video placeholder
      fontStyle: "italic",
      marginTop: "1em",
      marginBottom: "1em",
      pageBreakInside: "avoid", // Keep video placeholder together
    },
    img: {
      maxWidth: "100%",
      height: "auto",
      display: "block",
      margin: "1em auto",
      // pageBreakInside: "avoid" handled by common rule above
    },
    // Styles for Learning Objectives box to ensure it's readable
    ".learning-objectives-for-pdf": {
      mb: "1em",
      borderLeft: "4px solid #1976d2",
      pl: "1em",
      py: "0.5em",
      backgroundColor: "#e3f2fd",
      color: "#000",
      pageBreakInside: "avoid", // Keep learning objectives block together
      "& ul": {
        margin: 0,
        paddingLeft: "2em",
        color: "#000",
      },
      "& li": {
        color: "#000",
      },
      "& .MuiTypography-h6": {
        color: "#000",
        fontWeight: "bold",
        fontSize: "1.2rem", // Ensure objectives heading is readable
      },
      "& .MuiTypography-body1": {
        color: "#000",
        fontSize: "1.1rem", // Ensure objective list items are readable
      },
    },
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={
          isGenerating ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <DownloadIcon />
          )
        }
        onClick={handleDownloadPdf}
        disabled={isGenerating || !lesson}
        sx={{ mb: 3 }}
      >
        {isGenerating ? "Generating PDF..." : "Download Lesson as PDF"}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Hidden section for PDF generation */}
      {isGenerating && lesson && (
        <Box
          ref={printRef}
          sx={printStyles} // Apply all print-specific styles here
        >
          {/* Header content now rendered *inside* printRef for html2canvas to capture */}
          <Typography
            variant="h6"
            className="pdf-course-module-title"
            sx={{ mb: 0 }}
          >
            {courseTitle} - {moduleTitle}
          </Typography>
          <Typography variant="h4" className="pdf-header-title" sx={{ mt: 0 }}>
            {lesson.title}
          </Typography>
          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              margin: "2em 0",
            }}
          />

          {/* Learning Objectives for PDF - Now directly styled by printStyles */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <Box className="learning-objectives-for-pdf">
              {" "}
              {/* Added class for specific styling */}
              <Typography
                variant="h6"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                Learning Objectives:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: "2em", color: "#000" }}>
                {lesson.objectives.map((obj, idx) => (
                  <li key={idx}>
                    <Typography variant="body1" sx={{ color: "#000" }}>
                      {obj}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <LessonRenderer
            content={lesson.content.map((block) =>
              block.type === "video" ? { ...block, forPdfPrint: true } : block
            )}
            quiz={null}
          />
          {getPrintableQuiz(lesson.quiz)}
        </Box>
      )}
    </Box>
  );
}

export default LessonPDFExporter;
