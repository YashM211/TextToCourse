// client/src/components/LessonPDFExporter.jsx (Further Optimized for Layout and Size)
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
      await new Promise((resolve) => setTimeout(resolve, 200)); // Increased timeout for stability

      if (!printRef.current) {
        throw new Error("PDF content reference not found after rendering.");
      }

      const element = printRef.current;
      // Scroll the hidden element to its top to ensure full content capture
      element.scrollTop = 0;

      // Define A4 dimensions for PDF and desired DPI
      const A4_WIDTH_MM = 210;
      const DPI = 150; // Keep DPI at 150 for file size, adjust if quality is insufficient
      const PX_PER_MM = DPI / 25.4; // Pixels per millimeter (approx 5.9 px/mm at 150 DPI)

      // Margins for the PDF page (in mm)
      const pdfMarginLeftRight_mm = 15;
      const pdfMarginTopBottom_mm = 20;

      // Calculate the usable content width for PDF (in mm)
      const contentUsableWidth_mm = A4_WIDTH_MM - pdfMarginLeftRight_mm * 2; // e.g., 210 - 30 = 180mm

      // Calculate the pixel width that html2canvas should render the *content* into.
      // This is the actual width of the `printRef` element.
      const contentCaptureWidthPx = contentUsableWidth_mm * PX_PER_MM; // e.g., 180mm * 5.9 px/mm = ~1062px

      // --- html2canvas options ---
      const canvas = await html2canvas(element, {
        scale: DPI / 96, // Scale factor to render from browser's DPI (96) to target DPI (150)
        useCORS: true,
        logging: false,
        // Crucial: html2canvas should render *into* the exact content width.
        // The element (`printRef`) is already sized to this content width via CSS.
        width: contentCaptureWidthPx,
        windowWidth: contentCaptureWidthPx, // Important for consistent rendering context
        x: 0, // Capture from the very left of the `printRef` element (which is already the content area)
        y: 0, // Capture from the very top of the `printRef` element
        backgroundColor: "#ffffff", // Ensure white background
      });

      // Using JPEG with quality 0.8 for smaller file size
      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgProps = pdf.getImageProperties(imgData);
      // Calculate image height while maintaining aspect ratio, scaling to the content width in PDF (180mm)
      // The captured image's width (imgProps.width) corresponds to contentCaptureWidthPx
      const finalImageHeight_mm =
        (imgProps.height * contentUsableWidth_mm) / imgProps.width;

      let heightLeft = finalImageHeight_mm;
      let currentPdfY = pdfMarginTopBottom_mm; // Start content below top margin

      // Add Header (Course, Module, Lesson Title)
      pdf.setFontSize(18);
      pdf.text(`${courseTitle}`, pdfMarginLeftRight_mm, currentPdfY);
      currentPdfY += 8;
      pdf.setFontSize(14);
      pdf.text(`${moduleTitle}`, pdfMarginLeftRight_mm, currentPdfY);
      currentPdfY += 12;
      pdf.setFontSize(22);
      pdf.text(`${lesson.title}`, pdfMarginLeftRight_mm, currentPdfY);
      currentPdfY += 5;
      pdf.setDrawColor(0);
      pdf.line(
        pdfMarginLeftRight_mm,
        currentPdfY,
        pdfWidth - pdfMarginLeftRight_mm,
        currentPdfY
      );
      currentPdfY += 10; // Space after line, before content image starts

      // Calculate how much content image can fit on the first page below the header
      const firstPageContentUsableHeight =
        pdfHeight - currentPdfY - pdfMarginTopBottom_mm;

      // Initial Y position for placing the content image
      let imgSliceY = 0; // This tracks which part of the full image to show

      // Add the first part of the image
      pdf.addImage(
        imgData,
        "JPEG",
        pdfMarginLeftRight_mm,
        currentPdfY,
        contentUsableWidth_mm,
        firstPageContentUsableHeight,
        undefined,
        "FAST"
      );
      heightLeft -= firstPageContentUsableHeight;
      imgSliceY += firstPageContentUsableHeight;

      // Add remaining pages
      const pageContentHeight = pdfHeight - pdfMarginTopBottom_mm * 2; // Usable height for content on subsequent pages
      while (heightLeft > 0) {
        pdf.addPage();
        // Add image, offsetting the Y position to show the next slice
        pdf.addImage(
          imgData,
          "JPEG",
          pdfMarginLeftRight_mm,
          pdfMarginTopBottom_mm,
          contentUsableWidth_mm,
          finalImageHeight_mm,
          undefined,
          "FAST",
          imgSliceY,
          0
        );

        heightLeft -= pageContentHeight;
        imgSliceY += pageContentHeight;
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

  // Styles for the hidden print content - CRITICAL FOR LAYOUT AND DOM FLICKER
  const printStyles = {
    all: "initial", // Reset all inherited styles for a clean slate
    boxSizing: "border-box",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1.6,
    color: "#000",
    backgroundColor: "#fff",
    // Set the width of this outer Box to be the *content area* width in pixels.
    // This is what html2canvas will capture.
    width: `${(210 - 15 * 2) * (150 / 25.4)}px`, // 180mm * (150 DPI / 25.4 mm/inch) = ~1062px
    minHeight: `${297 * (150 / 25.4)}px`, // A4 height in pixels for sufficient rendering space
    // Crucial for hiding and preventing layout shifts
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
    zIndex: -1,
    overflow: "hidden", // Hide any scrollbars that might appear during capture
    padding: "0", // No padding on this outer box, as its width *is* the content width.

    // General styles for content within the print-ready Box
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      color: "#333",
      marginTop: "1.5em",
      marginBottom: "0.5em",
      pageBreakAfter: "avoid",
      fontWeight: "bold",
      "&.MuiTypography-h4": { fontSize: "1.4rem" },
      "&.MuiTypography-h5": { fontSize: "1.2rem" },
      "&.MuiTypography-h6": { fontSize: "1.1rem" },
    },
    "& p": {
      marginBottom: "1em",
      textAlign: "justify", // Justify text for a more formal document look
      fontSize: "1em",
    },
    "& ul, & ol": {
      marginLeft: "2em",
      marginBottom: "1em",
    },
    "& pre": {
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "4px",
      overflowX: "auto",
      fontFamily: "monospace",
      fontSize: "0.9em",
      color: "#333",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      pageBreakInside: "avoid",
    },
    "& code": {
      fontFamily: "monospace",
      backgroundColor: "#e0e0e0",
      padding: "2px 4px",
      borderRadius: "3px",
    },
    ".quiz-section-for-pdf": {
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      padding: "20px",
      marginTop: "30px",
      pageBreakBefore: "always",
    },
    ".quiz-question-for-pdf": {
      marginBottom: "15px",
    },
    ".quiz-option-for-pdf": {
      marginLeft: "20px",
      lineHeight: 1.8,
    },
    ".quiz-explanation-for-pdf": {
      fontSize: "0.9em",
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
      fontSize: "0.9em",
      fontStyle: "italic",
      marginTop: "1em",
      marginBottom: "1em",
    },
    // Ensure images in content don't exceed the content width
    img: {
      maxWidth: "100%",
      height: "auto",
      display: "block", // To remove extra space below image
      margin: "1em auto", // Center images
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
          {/* Learning Objectives for PDF - These are now directly inside printRef,
              and their padding/margins contribute to the overall content layout. */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <Box
              sx={{
                mb: "1em",
                borderLeft: "4px solid #1976d2",
                pl: "1em",
                py: "0.5em",
                backgroundColor: "#e3f2fd",
                color: "#000",
              }}
            >
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
