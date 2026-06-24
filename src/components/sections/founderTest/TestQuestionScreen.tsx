"use client";

import { Box, Typography } from "@mui/material";
import { ArrowBack as BackIcon, ArrowForward as NextIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import type { useFounderTestEngine } from "@/lib/hooks/useFounderTestEngine";

const T = {
  darkBg:    "#0D1B2E",
  darkGlow1: "rgba(99,102,241,0.12)",
  darkGlow2: "rgba(236,72,153,0.07)",
  darkBorder:"rgba(255,255,255,0.08)",
  darkMuted: "rgba(255,255,255,0.50)",
  darkFaint: "rgba(255,255,255,0.22)",
  white:     "#FFFFFF",
  bg:        "#F7F8FA",
  ink:       "#0A0A0F",
  inkMuted:  "#5A6478",
  inkFaint:  "#A0A0AE",
  border:    "rgba(10,10,20,0.08)",
  borderMd:  "rgba(10,10,20,0.16)",
  blue:      "#1D4ED8",
  blueBdr:   "rgba(29,78,216,0.22)",
  blueGlow:  "rgba(29,78,216,0.10)",
  grad:      "linear-gradient(115deg, #818CF8, #A855F7, #EC4899)",
  btn:       "linear-gradient(115deg, #7C3AED, #EC4899)",
  btnShadow: "0 4px 16px rgba(124,58,237,0.28)",
  error:     "#DC2626",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

type Engine = ReturnType<typeof useFounderTestEngine>;

function OptionRow({ id, label, selected, index, type, onClick }: {
  id: string; label: string; selected: boolean;
  index: number; type: "single" | "multiple" | "scale"; onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.28, ease: EASE }}
      whileTap={{ scale: 0.99 }}
    >
      <Box onClick={onClick} sx={{
        display: "flex", alignItems: "center", gap: 1.75,
        p: "11px 16px", borderRadius: "8px", cursor: "pointer",
        border: `1px solid ${selected ? T.blueBdr : T.border}`,
        background: selected ? `${T.blue}07` : T.white,
        transition: "all 0.15s",
        "&:hover": { borderColor: selected ? T.blueBdr : T.borderMd, background: selected ? `${T.blue}07` : T.bg },
      }}>
        <Box sx={{
          width: 18, height: 18, flexShrink: 0,
          borderRadius: type === "multiple" ? "5px" : "50%",
          border: `1.5px solid ${selected ? T.blue : T.border}`,
          background: selected ? T.blue : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}>
          {selected && type === "multiple" && (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {selected && type === "single" && (
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: T.white }} />
          )}
        </Box>
        <Typography sx={{
          fontFamily: SANS, fontSize: "0.875rem",
          color: selected ? T.ink : T.inkMuted,
          fontWeight: selected ? 500 : 400, lineHeight: 1.5, transition: "color 0.15s",
        }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

function ScaleRow({ options, selectedId, onSelect }: {
  options: { id: string; label: string; value: string }[];
  selectedId: string; onSelect: (id: string) => void;
}) {
  const selIdx = options.findIndex(o => o.id === selectedId);
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1.25 }}>
        {options.map((opt, i) => {
          const isSel = selectedId === opt.id;
          const isPast = selIdx >= 0 && i <= selIdx;
          return (
            <motion.div key={opt.id} style={{ flex: 1 }} whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: 0.26, ease: EASE }}>
              <Box onClick={() => onSelect(opt.id)} sx={{
                height: 44, borderRadius: "7px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${isSel ? T.blue : isPast ? T.blueBdr : T.border}`,
                background: isSel ? T.blue : isPast ? `${T.blue}08` : T.white,
                transition: "all 0.15s",
              }}>
                <Typography sx={{
                  fontFamily: MONO, fontWeight: 700, fontSize: "0.875rem",
                  color: isSel ? T.white : isPast ? T.blue : T.inkFaint, transition: "color 0.15s",
                }}>{i + 1}</Typography>
              </Box>
            </motion.div>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase" }}>{options[0]?.label}</Typography>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase" }}>{options[options.length - 1]?.label}</Typography>
      </Box>
    </Box>
  );
}

interface Props { engine: Engine; }

export function TestQuestionScreen({ engine }: Props) {
  const { currentQuestion, currentQuestionIndex, totalQuestions, getCurrentAnswer, handleAnswer, handleNext, handlePrev, canProceed } = engine;
  if (!currentQuestion) return null;

  const selectedIds = getCurrentAnswer(currentQuestion.id);
  const isLast = currentQuestionIndex === totalQuestions - 1;
  const pct = Math.round((currentQuestionIndex / totalQuestions) * 100);
  const blocked = !!(currentQuestion.isRequired && !canProceed());

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: SANS }}>

      {/* Dark top bar */}
      <Box sx={{ background: T.darkBg, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 90% at 5% 50%, ${T.darkGlow1}, transparent),
                       radial-gradient(ellipse 40% 70% at 95% 50%, ${T.darkGlow2}, transparent)`,
        }} />
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        <Box sx={{
          position: "relative", zIndex: 1,
          px: { xs: 3, md: 6 }, pt: 2.5, pb: 2,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Typography sx={{ fontFamily: MONO, fontSize: "0.54rem", letterSpacing: "0.18em", color: "#A5B4FC", textTransform: "uppercase" }}>
            Founder Assessment
          </Typography>
          {/* Dot progress */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.625 }}>
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <Box key={i} sx={{
                width: i === currentQuestionIndex ? 14 : 5,
                height: 5, borderRadius: "3px",
                background: i < currentQuestionIndex
                  ? "rgba(255,255,255,0.4)"
                  : i === currentQuestionIndex
                    ? "linear-gradient(90deg,#818CF8,#EC4899)"
                    : T.darkBorder,
                transition: "all 0.3s ease",
              }} />
            ))}
          </Box>
          <Typography sx={{ fontFamily: MONO, fontSize: "0.54rem", letterSpacing: "0.1em", color: T.darkFaint }}>
            {currentQuestionIndex + 1} / {totalQuestions}
          </Typography>
        </Box>
        {/* Gradient progress bar */}
        <Box sx={{ height: "2px", background: T.darkBorder }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.45, ease: EASE }}
            style={{ height: "100%", background: "linear-gradient(90deg,#818CF8,#EC4899)", borderRadius: "0 2px 2px 0" }} />
        </Box>
      </Box>

      {/* Light question area */}
      <Box sx={{
        flex: 1, background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 5 },
      }}>
        <Box sx={{ width: "100%", maxWidth: 580 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 18, filter: "blur(2px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -14, filter: "blur(2px)" }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Card */}
              <Box sx={{
                background: T.white, borderRadius: "10px",
                border: `1px solid ${T.border}`, overflow: "hidden",
                mb: 2, boxShadow: "0 2px 16px rgba(10,10,20,0.06)",
              }}>
                {/* Card header */}
                <Box sx={{
                  px: { xs: 2.5, md: 3 }, py: 1.125,
                  borderBottom: `1px solid ${T.border}`, background: T.bg,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <Typography sx={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.16em", color: T.inkFaint, textTransform: "uppercase" }}>
                    {currentQuestion.category}
                  </Typography>
                  {currentQuestion.type === "multiple" && (
                    <Typography sx={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.12em", color: T.blue, textTransform: "uppercase" }}>
                      Select all that apply
                    </Typography>
                  )}
                </Box>

                <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                  <Typography sx={{
                    fontFamily: SANS, fontWeight: 700,
                    fontSize: { xs: "1.0625rem", md: "1.25rem" },
                    color: T.ink, letterSpacing: "-0.02em",
                    lineHeight: 1.3, mb: currentQuestion.description ? 1 : 2.5,
                  }}>
                    {currentQuestion.question}
                  </Typography>
                  {currentQuestion.description && (
                    <Typography sx={{ fontFamily: SANS, fontSize: "0.85rem", color: T.inkFaint, lineHeight: 1.65, mb: 2.5 }}>
                      {currentQuestion.description}
                    </Typography>
                  )}

                  {currentQuestion.type === "scale" ? (
                    <ScaleRow options={currentQuestion.options} selectedId={selectedIds[0] ?? ""} onSelect={id => handleAnswer(currentQuestion.id, id, "scale")} />
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.875 }}>
                      {currentQuestion.options.map((opt, i) => (
                        <OptionRow key={opt.id} id={opt.id} label={opt.label}
                          selected={currentQuestion.type === "multiple" ? selectedIds.includes(opt.id) : selectedIds[0] === opt.id}
                          index={i} type={currentQuestion.type as "single" | "multiple"}
                          onClick={() => handleAnswer(currentQuestion.id, opt.id, currentQuestion.type as any)} />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Error */}
              <AnimatePresence>
                {blocked && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
                    <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.error, mb: 1.5 }}>
                      Please select an answer to continue.
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nav */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <motion.button onClick={handlePrev} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: "8px", border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", outline: "none" }}>
                  <BackIcon sx={{ fontSize: "0.85rem", color: T.inkFaint }} />
                  <Typography sx={{ fontFamily: SANS, fontWeight: 500, fontSize: "0.875rem", color: T.inkMuted }}>Back</Typography>
                </motion.button>

                <motion.button onClick={handleNext} disabled={blocked}
                  whileHover={blocked ? {} : { scale: 1.02 }} whileTap={blocked ? {} : { scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "11px 24px", borderRadius: "8px", border: "none",
                    background: blocked ? T.bg : T.btn,
                    cursor: blocked ? "not-allowed" : "pointer", outline: "none",
                    boxShadow: blocked ? "none" : T.btnShadow, transition: "all 0.15s",
                  }}>
                  <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.9rem", color: blocked ? T.inkFaint : T.white }}>
                    {isLast ? "Finish" : "Next"}
                  </Typography>
                  <NextIcon sx={{ fontSize: "0.875rem", color: blocked ? T.inkFaint : T.white }} />
                </motion.button>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}