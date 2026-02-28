"use client";

import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { colorTokens, shadowTokens } from "@/theme";
import type { useFounderTestEngine } from "@/lib/hooks/useFounderTestEngine";

type Engine = ReturnType<typeof useFounderTestEngine>;

interface TestQuestionScreenProps {
  engine: Engine;
}

export function TestQuestionScreen({ engine }: TestQuestionScreenProps) {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    getCurrentAnswer,
    handleAnswer,
    handleNext,
    handlePrev,
    canProceed,
  } = engine;

  if (!currentQuestion) return null;

  const selectedOptionIds = getCurrentAnswer(currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colorTokens.slate[50]} 0%, ${colorTokens.white} 100%)`,
        pt: { xs: 2, md: 4 },
        pb: 8,
      }}
    >
      <Container maxWidth="md">
        {/* Progress Header */}
        <Box sx={{ mb: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colorTokens.slate[500],
                fontWeight: 600,
                fontFamily: "var(--font-display)",
              }}
            >
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colorTokens.financeBlue[600],
                fontWeight: 700,
                fontFamily: "var(--font-display)",
              }}
            >
              {progress}% complete
            </Typography>
          </Box>

          {/* Segmented progress */}
          <Box sx={{ display: "flex", gap: 0.75 }}>
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: 4,
                  borderRadius: "999px",
                  overflow: "hidden",
                  backgroundColor: colorTokens.slate[200],
                }}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      i < currentQuestionIndex
                        ? "100%"
                        : i === currentQuestionIndex
                          ? "50%"
                          : "0%",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                    borderRadius: "999px",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <Box
              sx={{
                backgroundColor: colorTokens.white,
                borderRadius: "24px",
                border: `1px solid ${colorTokens.slate[100]}`,
                boxShadow: shadowTokens.xl,
                overflow: "hidden",
                mb: 3,
              }}
            >
              {/* Category indicator */}
              <Box
                sx={{
                  px: 4,
                  py: 1.5,
                  background: `linear-gradient(90deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    letterSpacing: "0.1em",
                    fontSize: "0.65rem",
                  }}
                >
                  {currentQuestion.category}
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 3, md: 5 } }}>
                {/* Question */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: colorTokens.darkNavy[900],
                    mb: 1.5,
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {currentQuestion.question}
                </Typography>

                {currentQuestion.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.7 }}
                  >
                    {currentQuestion.description}
                  </Typography>
                )}

                {/* Options */}
                <Box sx={{ mt: currentQuestion.description ? 0 : 4 }}>
                  {currentQuestion.type === "single" && (
                    <SingleChoiceOptions
                      options={currentQuestion.options}
                      selectedId={selectedOptionIds[0] ?? ""}
                      onSelect={(optionId) =>
                        handleAnswer(currentQuestion.id, optionId, "single")
                      }
                    />
                  )}
                  {currentQuestion.type === "multiple" && (
                    <MultipleChoiceOptions
                      options={currentQuestion.options}
                      selectedIds={selectedOptionIds}
                      onToggle={(optionId) =>
                        handleAnswer(currentQuestion.id, optionId, "multiple")
                      }
                    />
                  )}
                  {currentQuestion.type === "scale" && (
                    <ScaleOptions
                      options={currentQuestion.options}
                      selectedId={selectedOptionIds[0] ?? ""}
                      onSelect={(optionId) =>
                        handleAnswer(currentQuestion.id, optionId, "scale")
                      }
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handlePrev}
            variant="outlined"
            startIcon={<BackIcon />}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.25,
              fontWeight: 600,
              borderWidth: "1.5px",
              color: colorTokens.slate[600],
              borderColor: colorTokens.slate[200],
              "&:hover": {
                borderColor: colorTokens.slate[400],
                backgroundColor: colorTokens.slate[50],
              },
            }}
          >
            Back
          </Button>

          <Typography
            variant="caption"
            sx={{ color: colorTokens.slate[400], fontWeight: 500 }}
          >
            {currentQuestion.isRequired && !canProceed()
              ? "Please select an answer"
              : ""}
          </Typography>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleNext}
              disabled={currentQuestion.isRequired && !canProceed()}
              variant="contained"
              endIcon={<NextIcon />}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.25,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                boxShadow: "0 4px 16px rgba(26,86,219,0.3)",
                "&:hover": { boxShadow: "0 6px 20px rgba(26,86,219,0.4)" },
                "&.Mui-disabled": {
                  background: colorTokens.slate[200],
                  color: colorTokens.slate[400],
                  boxShadow: "none",
                },
              }}
            >
              {isLastQuestion ? "Finish Test" : "Next Question"}
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Single Choice ────────────────────────────────────────────────────────────

function SingleChoiceOptions({
  options,
  selectedId,
  onSelect,
}: {
  options: { id: string; label: string; value: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {options.map((option, i) => {
        const isSelected = selectedId === option.id;
        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Box
              onClick={() => onSelect(option.id)}
              sx={{
                p: "16px 20px",
                borderRadius: "14px",
                border: `2px solid ${isSelected ? colorTokens.financeBlue[500] : colorTokens.slate[200]}`,
                backgroundColor: isSelected
                  ? colorTokens.financeBlue[50]
                  : colorTokens.white,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease",
                boxShadow: isSelected
                  ? `0 4px 16px rgba(26,86,219,0.15)`
                  : "none",
                "&:hover": {
                  borderColor: isSelected
                    ? colorTokens.financeBlue[500]
                    : colorTokens.financeBlue[200],
                  backgroundColor: isSelected
                    ? colorTokens.financeBlue[50]
                    : colorTokens.slate[50],
                },
              }}
            >
              {/* Radio Indicator */}
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `2px solid ${isSelected ? colorTokens.financeBlue[500] : colorTokens.slate[300]}`,
                  backgroundColor: isSelected
                    ? colorTokens.financeBlue[500]
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected
                    ? colorTokens.financeBlue[700]
                    : colorTokens.slate[700],
                  lineHeight: 1.5,
                  transition: "all 0.2s ease",
                }}
              >
                {option.label}
              </Typography>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}

// ─── Multiple Choice ──────────────────────────────────────────────────────────

function MultipleChoiceOptions({
  options,
  selectedIds,
  onToggle,
}: {
  options: { id: string; label: string; value: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: colorTokens.slate[500],
          fontWeight: 500,
          mb: 0.5,
          display: "block",
        }}
      >
        Select all that apply
      </Typography>
      {options.map((option, i) => {
        const isSelected = selectedIds.includes(option.id);
        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Box
              onClick={() => onToggle(option.id)}
              sx={{
                p: "16px 20px",
                borderRadius: "14px",
                border: `2px solid ${isSelected ? colorTokens.financeBlue[500] : colorTokens.slate[200]}`,
                backgroundColor: isSelected
                  ? colorTokens.financeBlue[50]
                  : colorTokens.white,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease",
                boxShadow: isSelected
                  ? "0 4px 16px rgba(26,86,219,0.15)"
                  : "none",
                "&:hover": {
                  borderColor: isSelected
                    ? colorTokens.financeBlue[500]
                    : colorTokens.financeBlue[200],
                  backgroundColor: isSelected
                    ? colorTokens.financeBlue[50]
                    : colorTokens.slate[50],
                },
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "6px",
                  border: `2px solid ${isSelected ? colorTokens.financeBlue[500] : colorTokens.slate[300]}`,
                  backgroundColor: isSelected
                    ? colorTokens.financeBlue[500]
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {isSelected && (
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.2 }}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <motion.path
                      d="M2 6L5 9L10 3"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected
                    ? colorTokens.financeBlue[700]
                    : colorTokens.slate[700],
                  lineHeight: 1.5,
                  transition: "all 0.2s ease",
                }}
              >
                {option.label}
              </Typography>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}

// ─── Scale Options ────────────────────────────────────────────────────────────

function ScaleOptions({
  options,
  selectedId,
  onSelect,
}: {
  options: { id: string; label: string; value: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selectedIndex = options.findIndex((o) => o.id === selectedId);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        {options.map((option, i) => {
          const isSelected = selectedId === option.id;
          const isPast = selectedIndex >= 0 && i <= selectedIndex;
          return (
            <motion.div
              key={option.id}
              style={{ flex: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                onClick={() => onSelect(option.id)}
                sx={{
                  height: 48,
                  borderRadius: "12px",
                  border: `2px solid ${isSelected ? colorTokens.financeBlue[500] : isPast ? colorTokens.financeBlue[200] : colorTokens.slate[200]}`,
                  backgroundColor: isSelected
                    ? colorTokens.financeBlue[500]
                    : isPast
                      ? colorTokens.financeBlue[50]
                      : colorTokens.white,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(26,86,219,0.3)"
                    : "none",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: isSelected
                      ? "#fff"
                      : isPast
                        ? colorTokens.financeBlue[600]
                        : colorTokens.slate[500],
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9375rem",
                  }}
                >
                  {i + 1}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {options[0]?.label}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {options[options.length - 1]?.label}
        </Typography>
      </Box>
    </Box>
  );
}
