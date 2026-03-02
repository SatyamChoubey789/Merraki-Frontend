"use client";

import { useState, useRef, useCallback } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import type { Order, OrderStatus } from "@/types/order.types";

/* ══ TOKENS — exact footer color system ═════════════════ */
const T = {
  // Backgrounds
  bg:         "#FFFFFF",
  bgSection:  "#F5F7FB",
  bgDeep:     "#EDF3FF",

  // Ink — footer's exact values
  ink:        "#0A0A0F",
  inkDark:    "#1E1E2A",
  inkMid:     "#3A3A52",
  inkMuted:   "#5A5A72",
  inkFaint:   "#9898AE",

  // Border
  border:     "rgba(10,10,20,0.08)",
  borderMid:  "rgba(10,10,20,0.14)",

  // Blue — footer's exact values
  blue:       "#3B7BF6",
  blueMid:    "#5A92F8",
  blueLight:  "#7AABFF",
  bluePale:   "#EDF3FF",
  blueGlow:   "rgba(59,123,246,0.18)",
  blueDim:    "rgba(59,123,246,0.06)",
  blueDimHov: "rgba(59,123,246,0.12)",
  blueGrad:   "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
  blueBdr:    "rgba(59,123,246,0.22)",

  // Status colours (keeping semantic meaning, swapping palette)
  green:      "#16A34A",
  greenLight: "rgba(22,163,74,0.08)",
  greenBdr:   "rgba(22,163,74,0.2)",

  amber:      "#B45309",
  amberLight: "rgba(180,83,9,0.08)",
  amberBdr:   "rgba(180,83,9,0.2)",

  red:        "#DC2626",
  redLight:   "rgba(220,38,38,0.08)",
  redBdr:     "rgba(220,38,38,0.2)",

  slate:      "#5A5A72",
  slateLight: "rgba(90,90,114,0.07)",
  slateBdr:   "rgba(90,90,114,0.18)",

  white:      "#FFFFFF",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ── Status map ─────────────────────────────────────────── */
const STATUS: Record<
  OrderStatus,
  { label:string; icon:string; color:string; bg:string; bdr:string; desc:string }
> = {
  pending: {
    label: "Pending Review",
    icon:  "◷",
    color: T.amber,
    bg:    T.amberLight,
    bdr:   T.amberBdr,
    desc:  "Awaiting admin review.",
  },
  processing: {
    label: "Processing",
    icon:  "◈",
    color: T.blue,
    bg:    T.blueDim,
    bdr:   T.blueBdr,
    desc:  "Your order is being processed.",
  },
  approved: {
    label: "Approved",
    icon:  "✓",
    color: T.green,
    bg:    T.greenLight,
    bdr:   T.greenBdr,
    desc:  "Download is available below.",
  },
  rejected: {
    label: "Rejected",
    icon:  "✕",
    color: T.red,
    bg:    T.redLight,
    bdr:   T.redBdr,
    desc:  "Please contact support.",
  },
  refunded: {
    label: "Refunded",
    icon:  "↩",
    color: T.slate,
    bg:    T.slateLight,
    bdr:   T.slateBdr,
    desc:  "This order has been refunded.",
  },
};

/* ══ BLUE RULE — footer style ════════════════════════════ */
function BlueRule({ width = 24 }: { width?: number }) {
  return (
    <div style={{
      width, height: 2, flexShrink: 0, borderRadius: 2,
      background: T.blueGrad,
    }} />
  );
}

/* ══ SEARCH FORM ════════════════════════════════════════ */
function SearchForm({
  onSearch,
  isLoading,
}: {
  onSearch: (v: OrderTrackingFormValues) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderTrackingFormValues>({
    resolver: zodResolver(orderTrackingSchema),
  });
  const [focused, setFocused] = useState(false);

  return (
    <Box component="form" onSubmit={handleSubmit(onSearch)}>
      <Box sx={{
        display:    "flex",
        gap:        2,
        flexWrap:   { xs:"wrap", sm:"nowrap" },
        p:          2.5,
        background: T.bg,
        borderRadius: "16px",
        border: `1.5px solid ${focused ? T.blue : T.border}`,
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused
          ? `0 0 0 4px ${T.blueDim}, 0 2px 20px rgba(10,10,20,0.05)`
          : "0 2px 12px rgba(10,10,20,0.05)",
      }}>
        {/* Input */}
        <Box sx={{ flex:1, display:"flex", alignItems:"center", gap:1.25 }}>
          <SearchIcon sx={{ fontSize:"1rem", color: focused ? T.blue : T.inkFaint, flexShrink:0, transition:"color 0.18s" }} />
          <Box
            component="input"
            {...register("identifier")}
            placeholder="Email address or order number (MRK-XXXXXX)"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading}
            sx={{
              flex: 1, border:"none", outline:"none",
              background: "transparent",
              fontFamily: SANS, fontSize:"0.9375rem", color: T.ink,
              py: "4px",
              "&::placeholder": { color: T.inkFaint },
              "&:disabled": { cursor:"not-allowed" },
            }}
          />
        </Box>

        {/* Submit — blue gradient pill matching footer CTA */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={isLoading ? {} : { scale:1.02, boxShadow:`0 6px 24px ${T.blueGlow}` }}
          whileTap={isLoading ? {} : { scale:0.98 }}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          8,
            flexShrink:   0,
            padding:      "10px 22px",
            borderRadius: "10px",
            border:       "none",
            background:   isLoading ? T.bgSection : T.blueGrad,
            cursor:       isLoading ? "not-allowed" : "pointer",
            outline:      "none",
            boxShadow:    isLoading ? "none" : `0 4px 16px ${T.blueGlow}`,
            transition:   "box-shadow 0.18s",
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration:1, repeat:Infinity, ease:"linear" }}
              style={{
                width:14, height:14, borderRadius:"50%",
                border:`2px solid ${T.border}`,
                borderTopColor: T.blue,
              }}
            />
          ) : (
            <SearchIcon sx={{ fontSize:"0.9rem", color:"#FFFFFF" }} />
          )}
          <Typography sx={{
            fontFamily: SANS, fontWeight:700,
            fontSize:   "0.875rem",
            color:      isLoading ? T.inkFaint : "#FFFFFF",
            whiteSpace: "nowrap",
          }}>
            {isLoading ? "Searching…" : "Track Order"}
          </Typography>
        </motion.button>
      </Box>

      {errors.identifier && (
        <Typography sx={{ fontFamily:SANS, fontSize:"0.8125rem", color:T.red, mt:1, ml:1 }}>
          {errors.identifier.message}
        </Typography>
      )}
    </Box>
  );
}

/* ══ ORDER CARD ═════════════════════════════════════════ */
function OrderCard({
  order, onDownload, isDownloading, format,
}: {
  order: Order;
  onDownload: () => void;
  isDownloading: boolean;
  format: (n: number, c?: any) => string;
}) {
  const st  = STATUS[order.status];
  const ref = useRef<HTMLDivElement>(null);

  // Subtle 3-D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness:260, damping:28 });
  const sy = useSpring(my, { stiffness:260, damping:28 });
  const rx = useTransform(sy, [-0.5,0.5], ["3deg","-3deg"]);
  const ry = useTransform(sx, [-0.5,0.5], ["-3deg","3deg"]);
  const gX = useTransform(sx, [-0.5,0.5], ["10%","90%"]);
  const gY = useTransform(sy, [-0.5,0.5], ["10%","90%"]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const isApproved = order.status === "approved";

  return (
    <motion.div
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.52, ease:EASE }}
      style={{ perspective:1200, marginBottom:20 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX:rx, rotateY:ry, transformStyle:"preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ z:8 }}
      >
        <Box sx={{
          background:   T.bg,
          borderRadius: "18px",
          border:       `1px solid ${isApproved ? T.greenBdr : T.border}`,
          overflow:     "hidden",
          position:     "relative",
          boxShadow:    isApproved
            ? `0 4px 24px ${T.greenLight}`
            : "0 2px 14px rgba(10,10,20,0.05)",
          transition:   "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: isApproved ? T.greenBdr : T.blueBdr,
            boxShadow:   `0 12px 40px rgba(10,10,20,0.09)`,
          },
        }}>

          {/* Blue shimmer on hover — footer-style ambient */}
          <motion.div style={{
            position: "absolute", inset:0,
            borderRadius: "18px",
            pointerEvents: "none",
            zIndex: 1,
            background: `radial-gradient(circle at ${gX} ${gY}, ${T.blueDim} 0%, transparent 62%)`,
          }} />

          {/* ── Header strip ── */}
          <Box sx={{
            px: { xs:3, md:4 }, py:2.25,
            background:   T.bgSection,      // footer's F5F7FB
            borderBottom: `1px solid ${T.border}`,
            display:"flex", alignItems:"center",
            justifyContent:"space-between",
            flexWrap:"wrap", gap:2,
          }}>
            <Box>
              <Typography sx={{
                fontFamily:MONO, fontSize:"0.5rem",
                letterSpacing:"0.16em", color:T.inkFaint,
                textTransform:"uppercase", mb:0.25,
              }}>Order Number</Typography>
              <Typography sx={{
                fontFamily:MONO, fontWeight:700,
                fontSize:"1.125rem", color:T.ink, letterSpacing:"0.04em",
              }}>{order.orderNumber}</Typography>
            </Box>

            <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
              <Typography sx={{
                fontFamily:MONO, fontSize:"0.58rem",
                letterSpacing:"0.08em", color:T.inkFaint,
              }}>{formatDate(order.createdAt)}</Typography>

              {/* Status pill */}
              <Box sx={{
                display:"flex", alignItems:"center", gap:0.875,
                px:"10px", py:"5px", borderRadius:"100px",
                background: st.bg, border:`1px solid ${st.bdr}`,
              }}>
                <Typography sx={{ fontFamily:MONO, fontSize:"0.6rem", color:st.color, lineHeight:1 }}>
                  {st.icon}
                </Typography>
                <Typography sx={{
                  fontFamily:MONO, fontSize:"0.52rem",
                  letterSpacing:"0.12em", color:st.color, textTransform:"uppercase",
                }}>{st.label}</Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Status banner ── */}
          <Box sx={{
            px:{ xs:3, md:4 }, py:1.5,
            background:   st.bg,
            borderBottom: `1px solid ${T.border}`,
            display:"flex", alignItems:"center", gap:1.5,
          }}>
            <Box sx={{
              width:4, height:4, borderRadius:"50%", background:st.color,
              boxShadow: isApproved ? `0 0 8px ${T.green}66` : "none",
            }}>
              {isApproved && (
                <motion.div
                  animate={{ scale:[1,1.8,1], opacity:[1,0,1] }}
                  transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
                  style={{ width:4, height:4, borderRadius:"50%", background:T.green }}
                />
              )}
            </Box>
            <Typography sx={{ fontFamily:SANS, fontSize:"0.875rem", color:st.color, fontWeight:500 }}>
              {st.desc}
            </Typography>
          </Box>

          {/* ── Body ── */}
          <Box sx={{ px:{ xs:3, md:4 }, py:3, position:"relative", zIndex:1 }}>

            {/* Items label */}
            <Box sx={{ display:"flex", alignItems:"center", gap:1.5, mb:2 }}>
              {/* Blue rule instead of gold */}
              <Box sx={{ width:2, height:12, borderRadius:"2px", background:T.blueGrad }} />
              <Typography sx={{
                fontFamily:MONO, fontSize:"0.54rem",
                letterSpacing:"0.16em", color:T.inkFaint, textTransform:"uppercase",
              }}>Items Ordered</Typography>
            </Box>

            {/* Item rows */}
            <Box sx={{ display:"flex", flexDirection:"column", gap:1.25, mb:3 }}>
              {order.items.map((item, i) => (
                <Box key={i} sx={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  p:"12px 16px", borderRadius:"10px",
                  background:T.bgSection,          // footer's bgSection
                  border:`1px solid ${T.border}`,
                  transition:"border-color 0.18s, box-shadow 0.18s",
                  "&:hover":{
                    borderColor: T.blueBdr,
                    boxShadow: `0 2px 12px ${T.blueDim}`,
                  },
                }}>
                  <Box>
                    <Typography sx={{ fontFamily:SANS, fontWeight:500, fontSize:"0.875rem", color:T.ink }}>
                      {item.templateName}
                    </Typography>
                    <Typography sx={{
                      fontFamily:MONO, fontSize:"0.5rem",
                      letterSpacing:"0.1em", color:T.inkFaint,
                      textTransform:"uppercase", mt:0.25,
                    }}>Qty: {item.quantity} · {item.templateSlug}</Typography>
                  </Box>
                  {/* Price — blue accent instead of serif gold */}
                  <Typography sx={{
                    fontFamily:MONO, fontWeight:700,
                    fontSize:"0.95rem", color:T.blue, letterSpacing:"-0.01em",
                  }}>
                    {format(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ height:"1px", background:T.border, mb:3 }} />

            {/* Totals + download CTA */}
            <Box sx={{
              display:"flex", justifyContent:"space-between",
              alignItems:"flex-end", flexWrap:"wrap", gap:2,
            }}>
              <Box sx={{ display:"flex", flexDirection:"column", gap:0.75 }}>
                {[
                  { label:"Subtotal", val:format(order.subtotal), dim:true },
                  ...(order.discount > 0
                    ? [{ label:"Discount", val:`−${format(order.discount)}`, green:true }]
                    : []),
                ].map((r) => (
                  <Box key={r.label} sx={{ display:"flex", gap:3, justifyContent:"space-between" }}>
                    <Typography sx={{ fontFamily:SANS, fontSize:"0.875rem", color:T.inkFaint }}>{r.label}</Typography>
                    <Typography sx={{
                      fontFamily:SANS, fontSize:"0.875rem", fontWeight:500,
                      color:(r as any).green ? T.green : T.inkFaint,
                    }}>{r.val}</Typography>
                  </Box>
                ))}

                {/* Total row */}
                <Box sx={{
                  display:"flex", gap:3, justifyContent:"space-between",
                  pt:0.5, borderTop:`1px solid ${T.border}`,
                }}>
                  <Typography sx={{ fontFamily:SANS, fontSize:"0.9375rem", fontWeight:600, color:T.ink }}>
                    Total
                  </Typography>
                  {/* Blue gradient text for total — like footer headline */}
                  <Typography sx={{
                    fontFamily:SERIF, fontStyle:"italic",
                    fontSize:"1.375rem", letterSpacing:"-0.02em",
                    background:T.blueGrad,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  }}>
                    {format(order.total)}
                  </Typography>
                </Box>
              </Box>

              {/* Download button — blue gradient pill */}
              {order.downloadAvailable && isApproved && (
                <motion.div whileHover={{ scale:1.03, boxShadow:`0 8px 28px ${T.blueGlow}` }} whileTap={{ scale:0.97 }}>
                  <Box
                    component="button"
                    onClick={onDownload}
                    disabled={isDownloading}
                    sx={{
                      display:"flex", alignItems:"center", gap:1.25,
                      px:3, py:1.5, borderRadius:"100px",
                      border:"none",
                      background:   isDownloading ? T.bgSection : T.blueGrad,
                      cursor:       isDownloading ? "not-allowed" : "pointer",
                      outline:      "none",
                      boxShadow:    isDownloading ? "none" : `0 4px 18px ${T.blueGlow}`,
                      transition:   "box-shadow 0.18s",
                    }}
                  >
                    {isDownloading ? (
                      <motion.div
                        animate={{ rotate:360 }}
                        transition={{ duration:1, repeat:Infinity, ease:"linear" }}
                        style={{
                          width:14, height:14, borderRadius:"50%",
                          border:`2px solid ${T.blueDim}`,
                          borderTopColor: T.blue,
                        }}
                      />
                    ) : (
                      <DownloadIcon sx={{ fontSize:"1rem", color:"#FFFFFF" }} />
                    )}
                    <Typography sx={{
                      fontFamily:SANS, fontWeight:700, fontSize:"0.9375rem",
                      color: isDownloading ? T.inkFaint : "#FFFFFF",
                    }}>
                      {isDownloading ? "Downloading…" : "Download Files"}
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </Box>

            {/* Customer info footer */}
            <Box sx={{
              mt:2.5, pt:2.5, borderTop:`1px solid ${T.border}`,
              display:"flex", gap:4, flexWrap:"wrap",
            }}>
              {[
                { label:"Ordered by", val:order.customerDetails.name },
                { label:"Email",      val:order.customerDetails.email },
                ...(order.approvedAt
                  ? [{ label:"Approved on", val:formatDate(order.approvedAt), green:true }]
                  : []),
              ].map((f) => (
                <Box key={f.label}>
                  <Typography sx={{
                    fontFamily:MONO, fontSize:"0.48rem",
                    letterSpacing:"0.14em", color:T.inkFaint,
                    textTransform:"uppercase", mb:0.25,
                  }}>{f.label}</Typography>
                  <Typography sx={{
                    fontFamily:SANS, fontSize:"0.875rem", fontWeight:500,
                    color:(f as any).green ? T.green : T.inkDark,
                  }}>{f.val}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ EMPTY STATE ════════════════════════════════════════ */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.97 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.4, ease:EASE }}
    >
      <Box sx={{
        textAlign:"center", py:10,
        background:T.bg, borderRadius:"18px",
        border:`1px solid ${T.border}`,
      }}>
        <Typography sx={{ fontFamily:MONO, fontSize:"2.5rem", color:T.border, mb:2, lineHeight:1 }}>◈</Typography>
        <Typography sx={{ fontFamily:SERIF, fontStyle:"italic", fontSize:"1.5rem", color:T.ink, mb:1 }}>
          No orders found.
        </Typography>
        <Typography sx={{
          fontFamily:SANS, fontSize:"0.9rem", color:T.inkFaint,
          maxWidth:320, mx:"auto", lineHeight:1.7,
        }}>
          Double-check your email address or order number (MRK-XXXXXX).
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ══ PAGE ════════════════════════════════════════════════ */
export function OrderTrackingClient() {
  const [queryParams,    setQueryParams]    = useState<{ email?:string; orderNumber?:string } | null>(null);
  const [searchEnabled,  setSearchEnabled]  = useState(false);

  const { data, isLoading, isError } = useOrderLookup(queryParams ?? {}, searchEnabled && !!queryParams);
  const downloadMutation = useDownloadOrder();
  const { format }       = useCurrency();
  const orders           = data?.data ?? [];

  const onSearch = (values: OrderTrackingFormValues) => {
    const params = generateOrderTrackingParams(values.identifier);
    setQueryParams(params);
    setSearchEnabled(true);
  };

  return (
    <Box sx={{
      minHeight:  "100vh",
      background: T.bgSection,   // footer's F5F7FB — matches site bg
      fontFamily: SANS,
      pt: { xs:10, md:16 },
      pb: 14,
      /* Dot grid — same as footer */
      backgroundImage: `radial-gradient(circle, rgba(10,10,20,0.055) 1px, transparent 1px)`,
      backgroundSize:  "28px 28px",
      position: "relative",
    }}>
      {/* Blue ambient bloom — matches footer */}
      <Box sx={{
        position:"absolute", width:"60vw", height:"30vw",
        top:"-6vw", left:"20vw", borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(59,123,246,0.07) 0%, transparent 65%)",
        pointerEvents:"none", zIndex:0,
      }} />

      <Container maxWidth="md" sx={{ position:"relative", zIndex:1 }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55, ease:EASE }}
        >
          <Box sx={{ mb:5 }}>
           

            {/* Headline — footer's Instrument Serif italic */}
            <Typography sx={{
              fontFamily:   SERIF, fontStyle:"italic", fontWeight:400,
              fontSize:     { xs:"2.25rem", md:"3.25rem" },
              color:        T.ink,
              letterSpacing:"-0.03em", lineHeight:1.05, mb:1.5,
            }}>
              Track your{" "}
              <Box component="span" sx={{
                background:           T.blueGrad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundClip:       "text",
              }}>order.</Box>
            </Typography>

            <Typography sx={{
              fontFamily:SANS, fontSize:"0.9375rem",
              color:T.inkMuted, lineHeight:1.75, maxWidth:420,
            }}>
              Enter your email or order number to check your status and download your templates.
            </Typography>
          </Box>
        </motion.div>

        {/* ── Search form ── */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.5, ease:EASE }}
        >
          <Box sx={{ mb:5 }}>
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
          </Box>
        </motion.div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {searchEnabled && (
            <motion.div
              key="results"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              transition={{ duration:0.3 }}
            >
              {/* Error */}
              {isError && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}>
                  <Box sx={{
                    display:"flex", alignItems:"center", gap:1.5,
                    px:3, py:2, borderRadius:"12px",
                    background:T.redLight, border:`1px solid ${T.redBdr}`,
                    mb:3,
                  }}>
                    <Box sx={{ width:4, height:4, borderRadius:"50%", background:T.red, flexShrink:0 }} />
                    <Typography sx={{ fontFamily:SANS, fontSize:"0.875rem", color:T.red }}>
                      Failed to fetch orders. Please check your input and try again.
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {!isLoading && !isError && orders.length === 0 && <EmptyState />}

              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.08, duration:0.45, ease:EASE }}
                >
                  <OrderCard
                    order={order}
                    onDownload={() => downloadMutation.mutate(order.orderNumber)}
                    isDownloading={downloadMutation.isPending}
                    format={format}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}