"use client";

import { Box, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplate } from "@/lib/hooks/useTemplates";
import { useCart } from "@/lib/hooks/useCart";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface Props {
  slug: string;
  open: boolean;
  onClose: () => void;
}

/* ── Cool SaaS Tokens ───────────────────────────── */

const T = {
  white: "#FFFFFF",
  offwhite: "#F6F9FF",
  border: "#E2E8F0",

  ink: "#0B1220",
  inkMuted: "#475569",
  inkFaint: "#94A3B8",

  blue: "#2563EB",
  blueMid: "#3B82F6",
  blueSoft: "rgba(37,99,235,0.08)",

  green: "#16A34A",
};

/* ───────────────────────────────────────────────── */

export function TemplateDetailDrawer({ slug, open, onClose }: Props) {
  const { data, isLoading } = useTemplate(slug);
  const { addItem, isInCart } = useCart();
  const { format } = useCurrency();

  const template = data?.data;
  const inCart = template ? isInCart(template.id) : false;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.45)",
              backdropFilter: "blur(2px)",
              zIndex: 1200,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: "600px",
              background: T.white,
              zIndex: 1300,
              display: "flex",
              flexDirection: "column",
              borderLeft: `1px solid ${T.border}`,
              boxShadow: "-8px 0 30px rgba(15,23,42,0.08)",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: T.ink,
                }}
              >
                Template Preview
              </Typography>

              <CloseIcon
                sx={{
                  cursor: "pointer",
                  color: T.inkMuted,
                  "&:hover": { color: T.blue },
                }}
                onClick={onClose}
              />
            </Box>

            {isLoading || !template ? (
              <Box p={4}>Loading...</Box>
            ) : (
              <Box p={4} flex={1} overflow="auto">
                {/* Title */}
                <Typography
                  variant="h5"
                  mb={2}
                  sx={{ color: T.ink, fontWeight: 600 }}
                >
                  {template.title}
                </Typography>

                {/* Description */}
                <Typography mb={3} sx={{ color: T.inkMuted }}>
                  {template.description}
                </Typography>

                {/* Rating Row */}
                <Box display="flex" gap={2} alignItems="center" mb={3}>
                  <Box display="flex" gap={0.5}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        sx={{
                          fontSize: 16,
                          color:
                            i < Math.round(template.rating)
                              ? T.blueMid
                              : T.border,
                        }}
                      />
                    ))}
                  </Box>

                  <Typography fontSize={13} sx={{ color: T.inkMuted }}>
                    {template.rating.toFixed(1)} ({template.rating_count})
                  </Typography>

                  <Box display="flex" gap={0.5} alignItems="center">
                    <DownloadIcon
                      fontSize="small"
                      sx={{ color: T.inkFaint }}
                    />
                    <Typography fontSize={13} sx={{ color: T.inkMuted }}>
                      {template.downloads_count}
                    </Typography>
                  </Box>
                </Box>

                {/* Price */}
                <Typography
                  variant="h6"
                  mb={3}
                  sx={{
                    color: T.blue,
                    fontWeight: 600,
                  }}
                >
                  {format(template.price_inr / 100, "INR")}
                </Typography>

                {/* Add to Cart Button */}
                <Box
                  component="button"
                  onClick={() => {
                    if (!inCart) {
                      addItem(template);
                      onClose();
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: inCart ? "transparent" : T.blue,
                    color: inCart ? T.green : "#fff",
                    border: inCart ? `1px solid ${T.green}` : "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    boxShadow: inCart
                      ? "none"
                      : "0 6px 18px rgba(37,99,235,0.15)",
                  }}
                >
                  <CartIcon sx={{ mr: 1, fontSize: 18 }} />
                  {inCart ? "✓ Added to Cart" : "Add to Cart"}
                </Box>
              </Box>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}