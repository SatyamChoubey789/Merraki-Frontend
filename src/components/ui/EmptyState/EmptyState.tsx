"use client";

import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { colorTokens } from "@/theme";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: compact ? 4 : 8,
          px: 3,
          gap: 2,
        }}
      >
        {icon && (
          <Box
            sx={{
              width: compact ? 56 : 72,
              height: compact ? 56 : 72,
              borderRadius: "50%",
              backgroundColor: colorTokens.financeBlue[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colorTokens.financeBlue[400],
              fontSize: compact ? "1.5rem" : "2rem",
              mb: 1,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          variant={compact ? "h6" : "h5"}
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", maxWidth: 380, lineHeight: 1.7 }}
          >
            {description}
          </Typography>
        )}
        {actionLabel && onAction && (
          <Button
            variant="contained"
            color="primary"
            onClick={onAction}
            size={compact ? "small" : "medium"}
            sx={{ mt: 1 }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </motion.div>
  );
}
