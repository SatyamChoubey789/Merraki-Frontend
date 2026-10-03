"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  readDownloads,
  isDownloadExpired,
  describeExpiry,
  type StoredDownloads,
} from "@/lib/api/checkout";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  borderMid: "rgba(37,57,87,0.16)",
  primary: "#253957",
  green: "#0D7A5F",
  greenPale: "rgba(13,122,95,0.07)",
  greenBorder: "rgba(13,122,95,0.20)",
  amber: "#B45309",
  amberPale: "rgba(180,83,9,0.07)",
  amberBorder: "rgba(180,83,9,0.22)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;
const SUPPORT_EMAIL = "info@merrakisolutions.com";

// ─── Confetti (paid state only) ───────────────────────────────────────────────

const CONFETTI_COLORS = [T.primary, "#4A6FA5", "#6B8FC4", T.green, "#1A9B78"];

function ConfettiPiece({ index }: { index: number }) {
  const size = 5 + (index % 4) * 2;
  const round = index % 3 === 0;
  return (
    <motion.div
      initial={{
        y: -16,
        x: `${(index * 137.5) % 100}vw`,
        opacity: 1,
        rotate: 0,
        scale: 0,
      }}
      animate={{
        y: "105vh",
        opacity: [1, 1, 0],
        rotate: 360 * 2,
        scale: [0, 1, 1],
      }}
      transition={{
        delay: (index * 0.035) % 1,
        duration: 1.6 + (index % 5) * 0.25,
        ease: "easeIn",
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: round ? size : size * 0.4,
        borderRadius: round ? "50%" : "1px",
        background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

// ─── Page content ─────────────────────────────────────────────────────────────

function SuccessInner() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const pending = params.get("state") === "pending";
  const shortId = orderId?.slice(0, 8).toUpperCase();

  // sessionStorage only exists in the browser — read it after mount
  const [downloads, setDownloads] = useState<StoredDownloads | null>(null);
  useEffect(() => {
    if (orderId) setDownloads(readDownloads(orderId));
  }, [orderId]);

  const expired = downloads ? isDownloadExpired(downloads) : false;
  const hasLinks =
    !pending && !!downloads && downloads.items.length > 0 && !expired;

  const accent = pending ? T.amber : T.green;
  const accentBorder = pending ? T.amberBorder : T.greenBorder;
  const accentPale = pending ? T.amberPale : T.greenPale;

  const infoCopy = pending
    ? `This usually takes a minute or two. Once it's confirmed we'll email your receipt and download links. If nothing arrives within 15 minutes, write to ${SUPPORT_EMAIL} and quote your order number.`
    : expired
      ? `Your download links have expired. Open the receipt email we sent you to get fresh ones, or write to ${SUPPORT_EMAIL} and quote your order number.`
      : `Your receipt has been emailed to you — open it to get your download links. If you can't find it, check your spam folder or write to ${SUPPORT_EMAIL} and quote your order number.`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.bg,
        pt: { xs: 10, md: 14 },
        pb: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!pending &&
        Array.from({ length: 28 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            delay: 0.05,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <Box
            sx={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: T.surface,
              border: `1.5px solid ${accentBorder}`,
              boxShadow: `0 6px 28px ${accentPale}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {pending ? (
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle
                  cx="17"
                  cy="17"
                  r="12"
                  stroke={accent}
                  strokeWidth="2.5"
                />
                <motion.path
                  d="M17 10V17L22 20"
                  stroke={accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                />
              </svg>
            ) : (
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <motion.path
                  d="M7 17L14 24L27 10"
                  stroke={accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                />
              </svg>
            )}
          </Box>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.625rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 0.5,
              }}
            >
              {pending ? "We're confirming" : "Payment successful"}
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: { xs: "2rem", md: "2.625rem" },
                color: accent,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 2.5,
              }}
            >
              {pending ? "your payment." : "you're all set."}
            </Typography>

            {shortId && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: "6px",
                  borderRadius: "100px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: accent,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.72rem",
                    color: T.inkMuted,
                  }}
                >
                  Order #{shortId}
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Downloads, or what to do next */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
        >
          <Box
            sx={{
              background: T.surface,
              borderRadius: "16px",
              border: `1px solid ${T.borderMid}`,
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.25,
                borderBottom: `1px solid ${T.border}`,
                background: T.bg,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 14,
                  borderRadius: "2px",
                  background: T.primary,
                }}
              />
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: T.ink,
                }}
              >
                {hasLinks ? "Your downloads" : "What happens next"}
              </Typography>
            </Box>

            {hasLinks && downloads ? (
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                }}
              >
                {downloads.items.map((item) => (
                  <Box
                    key={item.downloadUrl}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      px: 2.5,
                      py: 1.75,
                      borderRadius: "12px",
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: T.ink,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Box
                      component="a"
                      href={item.downloadUrl}
                      rel="noopener noreferrer"
                      sx={{
                        flexShrink: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.75,
                        py: "8px",
                        borderRadius: "9px",
                        background: T.primary,
                        color: "#fff",
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        textDecoration: "none",
                        transition: "filter 0.18s",
                        "&:hover": { filter: "brightness(1.08)" },
                      }}
                    >
                      <DownloadIcon sx={{ fontSize: "0.95rem" }} />
                      Download
                    </Box>
                  </Box>
                ))}
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.75rem",
                    color: T.inkMuted,
                    lineHeight: 1.6,
                    mt: 0.5,
                  }}
                >
                  These links expire in {describeExpiry(downloads.expiresIn)}. A
                  receipt has also been emailed to you.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.875rem",
                    color: T.inkMid,
                    lineHeight: 1.75,
                  }}
                >
                  {infoCopy}
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45, ease: EASE }}
        >
          <Box
            component={Link}
            href="/templates"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              py: "13px",
              borderRadius: "12px",
              background: T.primary,
              color: "#fff",
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              transition: "filter 0.18s",
              "&:hover": { filter: "brightness(1.08)" },
            }}
          >
            Browse more templates
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

// useSearchParams() must sit inside a Suspense boundary or `next build` fails
// on statically rendered pages.
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
