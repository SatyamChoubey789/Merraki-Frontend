"use client";

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
  ShoppingCartOutlined as EmptyCartIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { colorTokens, shadowTokens } from "@/theme";
import { EmptyState } from "@/components/ui";
import type { CartItem } from "@/types/cart.types";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { useCartStore } from "@/lib/stores/cartStore";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const { format } = useCurrency();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          borderRadius: { sm: "20px 0 0 20px" },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${colorTokens.slate[100]}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: colorTokens.darkNavy[900],
            }}
          >
            Your Cart
          </Typography>
          {itemCount > 0 && (
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: "999px",
                background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Box>
          )}
        </Box>

        <IconButton
          onClick={closeDrawer}
          size="small"
          sx={{
            backgroundColor: colorTokens.slate[100],
            "&:hover": { backgroundColor: colorTokens.slate[200] },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={
                  <EmptyCartIcon
                    sx={{
                      fontSize: "2rem",
                      color: colorTokens.financeBlue[300],
                    }}
                  />
                }
                title="Your cart is empty"
                description="Browse our financial templates and add them to your cart."
                actionLabel="Browse Templates"
                onAction={closeDrawer}
              />
            </motion.div>
          ) : (
            <Stack spacing={2}>
              {items.map((item) => (
                <CartItemRow
                  key={item.templateId}
                  item={item}
                  onRemove={() => removeItem(item.templateId)}
                  onUpdateQty={(qty) => updateQuantity(item.templateId, qty)}
                  formatPrice={format}
                />
              ))}
            </Stack>
          )}
        </AnimatePresence>
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderTop: `1px solid ${colorTokens.slate[100]}`,
            flexShrink: 0,
            background: colorTokens.slate[50],
          }}
        >
          {/* Subtotal */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                color: colorTokens.financeBlue[600],
                letterSpacing: "-0.02em",
              }}
            >
              {format(subtotal)}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 2, lineHeight: 1.5 }}
          >
            Tax included. Downloads available after order approval.
          </Typography>

          <Stack spacing={1.5}>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                component={Link}
                href="/checkout"
                variant="contained"
                fullWidth
                size="large"
                onClick={closeDrawer}
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  boxShadow: "0 4px 16px rgba(26,86,219,0.3)",
                  py: 1.75,
                  fontSize: "1rem",
                  fontWeight: 700,
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(26,86,219,0.4)",
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </motion.div>

            <Button
              variant="text"
              fullWidth
              onClick={closeDrawer}
              sx={{
                color: colorTokens.slate[500],
                py: 1,
                fontSize: "0.875rem",
              }}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}

// ─── Cart Item Row ───────────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
  formatPrice: (amount: number) => string;
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
  formatPrice,
}: CartItemRowProps) {
  const { template, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          borderRadius: "14px",
          border: `1px solid ${colorTokens.slate[100]}`,
          backgroundColor: colorTokens.white,
          boxShadow: shadowTokens.sm,
          position: "relative",
        }}
      >
        {/* Thumbnail */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "10px",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: colorTokens.financeBlue[50],
          }}
        >
          {template.thumbnailUrl ? (
            <Image
              src={template.thumbnailUrl}
              alt={template.name}
              width={72}
              height={72}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              📊
            </Box>
          )}
        </Box>

        {/* Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: colorTokens.darkNavy[800],
              fontFamily: "var(--font-display)",
              lineHeight: 1.3,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {template.name}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: colorTokens.slate[500],
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 600,
              display: "block",
              mb: 1.5,
            }}
          >
            {template.format}
          </Typography>

          {/* Qty + Price */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Quantity Controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                border: `1px solid ${colorTokens.slate[200]}`,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <IconButton
                size="small"
                onClick={() => onUpdateQty(quantity - 1)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 0,
                  color: colorTokens.slate[600],
                  "&:hover": { backgroundColor: colorTokens.slate[100] },
                }}
              >
                <RemoveIcon sx={{ fontSize: "0.875rem" }} />
              </IconButton>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  minWidth: 24,
                  textAlign: "center",
                  color: colorTokens.darkNavy[800],
                  fontFamily: "var(--font-display)",
                }}
              >
                {quantity}
              </Typography>

              <IconButton
                size="small"
                onClick={() => onUpdateQty(quantity + 1)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 0,
                  color: colorTokens.slate[600],
                  "&:hover": { backgroundColor: colorTokens.slate[100] },
                }}
              >
                <AddIcon sx={{ fontSize: "0.875rem" }} />
              </IconButton>
            </Box>

            {/* Price */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: colorTokens.financeBlue[600],
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.01em",
              }}
            >
              {formatPrice(template.price * quantity)}
            </Typography>
          </Box>
        </Box>

        {/* Remove */}
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: colorTokens.slate[400],
            width: 24,
            height: 24,
            "&:hover": {
              color: colorTokens.error.main,
              backgroundColor: colorTokens.error.light,
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: "0.9375rem" }} />
        </IconButton>
      </Box>
    </motion.div>
  );
}
