"use client";

import { Box, Alert, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/lib/stores/uiStore";
import { colorTokens, shadowTokens } from "@/theme";

export function ToastContainer() {
  const { toasts, removeToast } = useUiStore();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        maxWidth: 400,
        width: { xs: "calc(100vw - 48px)", sm: 380 },
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Alert
              severity={toast.type}
              variant="filled"
              action={
                <IconButton
                  size="small"
                  onClick={() => removeToast(toast.id)}
                  sx={{
                    color: "inherit",
                    opacity: 0.8,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                borderRadius: "12px",
                boxShadow: shadowTokens.xl,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.9rem",
                alignItems: "center",
              }}
            >
              {toast.message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
