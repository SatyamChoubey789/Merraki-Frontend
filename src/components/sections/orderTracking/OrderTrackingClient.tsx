"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
  Inventory as PackageIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorTokens, shadowTokens } from "@/theme";
import { useOrderLookup, useDownloadOrder } from "@/lib/hooks/useOrderTracking";
import { useCurrency } from "@/lib/hooks/useCurrency";
import {
  orderTrackingSchema,
  type OrderTrackingFormValues,
} from "@/lib/schemas/orderTracking.schema";
import {
  generateOrderTrackingParams,
  formatDate,
} from "@/lib/utils/formatters";
import { SectionLabel, GradientText } from "@/components/ui";
import type { Order, OrderStatus } from "@/types/order.types";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  pending: {
    label: "Pending Review",
    color: colorTokens.warning.main,
    bg: colorTokens.warning.light,
    icon: <PendingIcon />,
    description: "Your order is awaiting admin review.",
  },
  processing: {
    label: "Processing",
    color: colorTokens.financeBlue[500],
    bg: colorTokens.financeBlue[50],
    icon: <PendingIcon />,
    description: "Your order is being processed.",
  },
  approved: {
    label: "Approved",
    color: colorTokens.success.main,
    bg: colorTokens.success.light,
    icon: <ApprovedIcon />,
    description: "Your order is approved. Download is available.",
  },
  rejected: {
    label: "Rejected",
    color: colorTokens.error.main,
    bg: colorTokens.error.light,
    icon: <RejectedIcon />,
    description: "Your order was rejected. Please contact support.",
  },
  refunded: {
    label: "Refunded",
    color: colorTokens.slate[600],
    bg: colorTokens.slate[100],
    icon: <RejectedIcon />,
    description: "This order has been refunded.",
  },
};

export function OrderTrackingClient() {
  const [queryParams, setQueryParams] = useState<{
    email?: string;
    orderNumber?: string;
  } | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderTrackingFormValues>({
    resolver: zodResolver(orderTrackingSchema),
  });

  const { data, isLoading, isError } = useOrderLookup(
    queryParams ?? {},
    searchEnabled && !!queryParams,
  );

  const downloadMutation = useDownloadOrder();
  const { format } = useCurrency();

  const orders = data?.data ?? [];

  const onSubmit = (values: OrderTrackingFormValues) => {
    const params = generateOrderTrackingParams(values.identifier);
    setQueryParams(params);
    setSearchEnabled(true);
  };

  return (
    <Box
      sx={{
        pt: { xs: 6, md: 10 },
        pb: 10,
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colorTokens.financeBlue[50]} 0%, ${colorTokens.white} 40%)`,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <SectionLabel text="Order Management" color="blue" />
          <Typography
            variant="h2"
            sx={{
              mt: 2,
              mb: 2,
              fontWeight: 800,
              color: colorTokens.darkNavy[900],
            }}
          >
            Track Your <GradientText>Order</GradientText>
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 480, mx: "auto", lineHeight: 1.7 }}
          >
            Enter your email address or order number to check your order status
            and download your templates.
          </Typography>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              backgroundColor: colorTokens.white,
              borderRadius: "20px",
              p: { xs: 3, md: 4 },
              boxShadow: shadowTokens.lg,
              border: `1px solid ${colorTokens.slate[100]}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2.5,
                color: colorTokens.darkNavy[800],
              }}
            >
              Find Your Order
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                {...register("identifier")}
                placeholder="Email address or order number (MRK-XXXXXX)"
                fullWidth
                error={!!errors.identifier}
                helperText={errors.identifier?.message}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        mr: 1,
                        color: colorTokens.slate[400],
                        display: "flex",
                      }}
                    >
                      <SearchIcon fontSize="small" />
                    </Box>
                  ),
                }}
                disabled={isLoading}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flexShrink: 0 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={16} sx={{ color: "#fff" }} />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.75,
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    fontWeight: 700,
                    borderRadius: "12px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 16px rgba(26,86,219,0.3)",
                    minWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  {isLoading ? "Searching…" : "Track Order"}
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searchEnabled && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {isError && (
                <Alert severity="error" sx={{ borderRadius: "14px", mb: 3 }}>
                  Failed to fetch orders. Please check your input and try again.
                </Alert>
              )}

              {!isLoading && !isError && orders.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    backgroundColor: colorTokens.white,
                    borderRadius: "20px",
                    border: `1px solid ${colorTokens.slate[100]}`,
                    boxShadow: shadowTokens.md,
                  }}
                >
                  <PackageIcon
                    sx={{
                      fontSize: "3rem",
                      color: colorTokens.slate[300],
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={colorTokens.slate[700]}
                    mb={1}
                  >
                    No Orders Found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 360, mx: "auto" }}
                  >
                    We couldn&apos;t find any orders matching your input. Please
                    double-check your email or order number.
                  </Typography>
                </Box>
              )}

              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onDownload={() => downloadMutation.mutate(order.orderNumber)}
                  isDownloading={downloadMutation.isPending}
                  format={format}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}

// ─── Order Card ──────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onDownload: () => void;
  isDownloading: boolean;
  format: (amount: number) => string;
}

function OrderCard({
  order,
  onDownload,
  isDownloading,
  format,
}: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <Box
      sx={{
        backgroundColor: colorTokens.white,
        borderRadius: "20px",
        border: `1px solid ${colorTokens.slate[100]}`,
        boxShadow: shadowTokens.md,
        overflow: "hidden",
        mb: 3,
      }}
    >
      {/* Order Header */}
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          backgroundColor: colorTokens.slate[50],
          borderBottom: `1px solid ${colorTokens.slate[100]}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: colorTokens.slate[500], fontWeight: 500, mb: 0.25 }}
          >
            Order Number
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.125rem",
              color: colorTokens.darkNavy[900],
              letterSpacing: "0.02em",
            }}
          >
            {order.orderNumber}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(order.createdAt)}
          </Typography>
          <Chip
            icon={
              <Box
                sx={{
                  color: `${statusConfig.color} !important`,
                  display: "flex",
                  "& svg": { fontSize: "1rem" },
                }}
              >
                {statusConfig.icon}
              </Box>
            }
            label={statusConfig.label}
            sx={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              fontWeight: 700,
              fontSize: "0.8125rem",
              borderRadius: "8px",
              height: 32,
              border: `1px solid ${statusConfig.color}22`,
            }}
          />
        </Box>
      </Box>

      {/* Status Banner */}
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2,
          backgroundColor: `${statusConfig.bg}88`,
          borderBottom: `1px solid ${colorTokens.slate[100]}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box sx={{ color: statusConfig.color, display: "flex" }}>
          {statusConfig.icon}
        </Box>
        <Typography
          variant="body2"
          sx={{ color: statusConfig.color, fontWeight: 600 }}
        >
          {statusConfig.description}
        </Typography>
      </Box>

      {/* Order Items */}
      <Box sx={{ px: { xs: 3, md: 4 }, py: 3 }}>
        <Typography
          variant="overline"
          sx={{
            color: colorTokens.slate[400],
            letterSpacing: "0.08em",
            mb: 2,
            display: "block",
          }}
        >
          Items Ordered
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {order.items.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: "12px",
                backgroundColor: colorTokens.slate[50],
                border: `1px solid ${colorTokens.slate[100]}`,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: colorTokens.darkNavy[800] }}
                >
                  {item.templateName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Qty: {item.quantity} · {item.templateSlug}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: colorTokens.financeBlue[600],
                  fontFamily: "var(--font-display)",
                }}
              >
                {format(item.price * item.quantity)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Totals + Download */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 4,
                mb: 0.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {format(order.subtotal)}
              </Typography>
            </Box>
            {order.discount > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 4,
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" color={colorTokens.success.main}>
                  Discount
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={colorTokens.success.main}
                >
                  -{format(order.discount)}
                </Typography>
              </Box>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}
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
                  fontSize: "1.25rem",
                  color: colorTokens.financeBlue[600],
                  letterSpacing: "-0.02em",
                }}
              >
                {format(order.total)}
              </Typography>
            </Box>
          </Box>

          {order.downloadAvailable && order.status === "approved" && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  isDownloading ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={onDownload}
                disabled={isDownloading}
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.success.main}, #059669)`,
                  px: 3,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                  "&:hover": { boxShadow: "0 6px 20px rgba(16,185,129,0.4)" },
                }}
              >
                {isDownloading ? "Downloading…" : "Download Files"}
              </Button>
            </motion.div>
          )}
        </Box>

        {/* Customer Info */}
        <Box
          sx={{
            mt: 2.5,
            pt: 2.5,
            borderTop: `1px solid ${colorTokens.slate[100]}`,
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.25 }}
            >
              Ordered by
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color={colorTokens.darkNavy[800]}
            >
              {order.customerDetails.name}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.25 }}
            >
              Email
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color={colorTokens.darkNavy[800]}
            >
              {order.customerDetails.email}
            </Typography>
          </Box>
          {order.approvedAt && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.25 }}
              >
                Approved on
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color={colorTokens.success.main}
              >
                {formatDate(order.approvedAt)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
