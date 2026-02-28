"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  ShoppingBag as BagIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorTokens, shadowTokens } from "@/theme";
import { useCart } from "@/lib/hooks/useCart";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { useCheckout } from "@/lib/hooks/useCheckout";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/schemas/checkout.schema";

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, itemCount, subtotalFormatted } = useCart();
  const { format } = useCurrency();
  const { initiateCheckout, isProcessing } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (itemCount === 0) router.replace("/templates");
  }, [itemCount, router]);

  if (itemCount === 0) return null;

  const onSubmit = (data: CheckoutFormValues) => {
    initiateCheckout(data);
  };

  return (
    <Box
      sx={{
        pt: { xs: 6, md: 8 },
        pb: 10,
        minHeight: "100vh",
        backgroundColor: colorTokens.slate[50],
      }}
    >
      <Container maxWidth="lg">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
            <LockIcon
              sx={{ color: colorTokens.financeBlue[500], fontSize: "1.5rem" }}
            />
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: colorTokens.darkNavy[900] }}
            >
              Secure Checkout
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Left — Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  backgroundColor: colorTokens.white,
                  borderRadius: "20px",
                  p: { xs: 3, md: 4 },
                  boxShadow: shadowTokens.md,
                  border: `1px solid ${colorTokens.slate[100]}`,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: colorTokens.darkNavy[900],
                  }}
                >
                  Your Details
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register("name")}
                      label="Full Name *"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={isProcessing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register("email")}
                      label="Email Address *"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={
                        errors.email?.message ??
                        "Your order confirmation and download link will be sent here"
                      }
                      disabled={isProcessing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register("phone")}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      disabled={isProcessing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register("company")}
                      label="Company (optional)"
                      fullWidth
                      disabled={isProcessing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register("couponCode")}
                      label="Coupon Code (optional)"
                      fullWidth
                      disabled={isProcessing}
                      placeholder="Enter promo code"
                    />
                  </Grid>
                </Grid>

                <Alert
                  severity="info"
                  sx={{ mt: 3, mb: 3, borderRadius: "12px" }}
                  icon={<LockIcon fontSize="small" />}
                >
                  Your payment is secured by Razorpay. We never store your card
                  details.
                </Alert>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isProcessing}
                    startIcon={
                      isProcessing ? (
                        <CircularProgress size={18} sx={{ color: "#fff" }} />
                      ) : (
                        <LockIcon />
                      )
                    }
                    sx={{
                      py: 1.75,
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                      boxShadow: "0 6px 20px rgba(26,86,219,0.35)",
                      borderRadius: "14px",
                      "&:hover": {
                        boxShadow: "0 10px 28px rgba(26,86,219,0.4)",
                      },
                      "&.Mui-disabled": {
                        background: colorTokens.slate[200],
                        color: colorTokens.slate[400],
                      },
                    }}
                  >
                    {isProcessing
                      ? "Processing…"
                      : `Pay ${subtotalFormatted} Securely`}
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Right — Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Box
                sx={{
                  backgroundColor: colorTokens.white,
                  borderRadius: "20px",
                  p: { xs: 3, md: 4 },
                  boxShadow: shadowTokens.md,
                  border: `1px solid ${colorTokens.slate[100]}`,
                  position: "sticky",
                  top: 100,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <BagIcon sx={{ color: colorTokens.financeBlue[500] }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: colorTokens.darkNavy[900] }}
                  >
                    Order Summary
                  </Typography>
                </Box>

                {/* Items */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {items.map((item) => (
                    <Box
                      key={item.templateId}
                      sx={{ display: "flex", gap: 2, alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "10px",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: colorTokens.financeBlue[50],
                        }}
                      >
                        {item.template.thumbnailUrl ? (
                          <Image
                            src={item.template.thumbnailUrl}
                            alt={item.template.name}
                            width={52}
                            height={52}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.25rem",
                            }}
                          >
                            📊
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: colorTokens.darkNavy[800],
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity} ·{" "}
                          {item.template.format.toUpperCase()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: colorTokens.financeBlue[600],
                          flexShrink: 0,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {format(
                          item.template.price * item.quantity,
                          item.template.currency as "INR",
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Totals */}
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {subtotalFormatted}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Tax
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Included
                    </Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      color={colorTokens.darkNavy[900]}
                    >
                      Total
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.375rem",
                        color: colorTokens.financeBlue[600],
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {subtotalFormatted}
                    </Typography>
                  </Box>
                </Box>

                {/* Trust badges */}
                <Box
                  sx={{
                    mt: 3,
                    pt: 2.5,
                    borderTop: `1px solid ${colorTokens.slate[100]}`,
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    "🔒 Secure Payment",
                    "📧 Instant Email",
                    "✅ Admin Verified",
                  ].map((badge) => (
                    <Typography
                      key={badge}
                      variant="caption"
                      sx={{
                        color: colorTokens.slate[500],
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {badge}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
