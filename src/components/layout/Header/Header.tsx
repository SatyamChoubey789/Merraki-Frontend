"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Drawer,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./navLinks";
import { useCartStore } from "@/lib/stores/cartStore";
import { CurrencySelector } from "../CurrencySelector/CurrencySelector";
import { MerrakiLogoAnimated } from "@/components/ui/MerrakiLogo/MerrakiLogo";

/* ══ TOKENS — LIGHT THEME ════════════════════════════ */
const T = {
  bgScrolled: "rgba(255,250,242,0.96)",
  borderScrolled: "rgba(184,146,42,0.18)",

  ink: "#1A1712",
  inkMid: "#2E2A23",
  inkMuted: "#7A6F5A",
  inkFaint: "#A89C84",

  gold: "#B8922A",
  goldMid: "#C9A84C",
  goldLight: "#DDB96A",
  goldGlow: "rgba(184,146,42,0.18)",
  goldDim: "rgba(184,146,42,0.10)",

  drawerBg: "#FFFFFF",
  drawerBorder: "rgba(184,146,42,0.18)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* ══ HEADER ══════════════════════════════════════════════ */
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMounted = useIsMounted();
  const _itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openDrawer);
  const itemCount  = isMounted ? _itemCount : 0;

  const fgColor = T.inkMid;
  const fgMuted = T.inkMuted;
  const hoverBg = "rgba(184,146,42,0.08)";
  const hoverColor = T.ink;

  return (
    <>
      <motion.header
        animate={{
          background: T.bgScrolled,
          borderBottom: `1px solid ${T.borderScrolled}`,
          boxShadow: "0 8px 30px rgba(120,90,40,0.06)",
        }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: { xs: 62, md: 68 },
            }}
          >
            {/* ── Logo ── */}
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <MerrakiLogoAnimated
                variant="gold"
                animate={false}
              />
            </Link>

            {/* ── Desktop Nav ── */}
            <Box
              component="nav"
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 0,
                mx: "auto",
              }}
            >
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  isActive={pathname === link.href}
                  fgMuted={fgMuted}
                  hoverBg={hoverBg}
                  hoverColor={hoverColor}
                />
              ))}
            </Box>

            {/* ── Right actions ── */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <CurrencySelector isDark={false} />
              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={openCart}
                  size="small"
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    color: fgMuted,
                    transition: "all 0.18s ease",
                    "&:hover": { background: hoverBg, color: hoverColor },
                  }}
                >
                  <Badge
                    badgeContent={itemCount}
                    max={9}
                    sx={{
                      "& .MuiBadge-badge": {
                        background: `linear-gradient(135deg,${T.gold},${T.goldLight})`,
                        color: "#0C0B08",
                        fontWeight: 700,
                        fontSize: "0.52rem",
                        minWidth: 15,
                        height: 15,
                        padding: "0 3px",
                      },
                    }}
                  >
                    <CartIcon sx={{ fontSize: "1.15rem" }} />
                  </Badge>
                </IconButton>
              </motion.div>

              <Box sx={{ display: { xs: "none", md: "block" }, ml: 0.5 }}>
                <BookButton />
              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  size="small"
                  sx={{
                    display: { xs: "flex", lg: "none" },
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    color: fgMuted,
                    ml: 0.25,
                    transition: "all 0.18s ease",
                    "&:hover": { background: hoverBg, color: hoverColor },
                  }}
                >
                  <MenuIcon sx={{ fontSize: "1.2rem" }} />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </motion.header>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        itemCount={itemCount}
        openCart={openCart}
      />
    </>
  );
}

/* ══ BOOK BUTTON ══════════════════════════════════ */
function BookButton() {
  return (
    <Link href="/book-consultation" style={{ textDecoration: "none" }}>
      <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: "18px",
            py: "9px",
            borderRadius: "10px",
            background: `linear-gradient(135deg,${T.gold},${T.goldLight})`,
            border: "1px solid transparent",
            boxShadow: `0 4px 20px ${T.goldGlow}`,
            transition: "all 0.22s ease",
            cursor: "pointer",
            "&:hover": {
              background: `linear-gradient(135deg,${T.goldMid},${T.gold})`,
              boxShadow: `0 6px 28px ${T.goldGlow}`,
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "#1A1712",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Book a call
          </Typography>
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              color: "rgba(26,23,18,0.45)",
              lineHeight: 1,
            }}
          >
            →
          </Typography>
        </Box>
      </motion.div>
    </Link>
  );
}

/* ══ NAV ITEM ═════════════════════════════════════ */
interface NavItemProps {
  link: { label: string; href: string; badge?: string };
  isActive: boolean;
  fgMuted: string;
  hoverBg: string;
  hoverColor: string;
}



function NavItem({
  link,
  isActive,
  fgMuted,
  hoverBg,
  hoverColor,
}: NavItemProps) {
  return (
    <Link href={link.href} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          position: "relative",
          px: 1.75,
          py: 1,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          cursor: "pointer",
          transition: "background 0.18s ease",
          "&:hover": { background: hoverBg },
          "&:hover .label": { color: `${hoverColor} !important` },
        }}
      >
        <Typography
          className="label"
          sx={{
            fontFamily: SANS,
            fontWeight: isActive ? 600 : 450,
            fontSize: "0.875rem",
            color: isActive ? T.goldLight : fgMuted,
            transition: "color 0.18s ease",
            lineHeight: 1,
          }}
        >
          {link.label}
        </Typography>
        {link.badge && (
          <Box
            sx={{
              px: "6px",
              py: "2.5px",
              borderRadius: "5px",
              background: `linear-gradient(135deg,${T.gold},${T.goldLight})`,
              fontFamily: MONO,
              fontSize: "0.48rem",
              fontWeight: 700,
              color: "#0C0B08",
              lineHeight: 1.5,
            }}
          >
            {link.badge}
          </Box>
        )}
      </Box>
    </Link>
  );
}

/* ══ MOBILE DRAWER ═════════════════════════════════════ */
function MobileDrawer({
  open,
  onClose,
  pathname,
  itemCount,
  openCart,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  itemCount: number;
  openCart: () => void;
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          background: T.drawerBg,
          borderLeft: `1px solid ${T.drawerBorder}`,
          boxShadow: "-20px 0 80px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <MerrakiLogoAnimated variant="gold" animate={false} />
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              color: T.inkMuted,
              border: `1px solid ${T.drawerBorder}`,
              "&:hover": { color: T.goldLight, borderColor: T.goldLight },
            }}
          >
            <CloseIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>

        {/* Nav links */}
        <Box
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.75,
                  py: 1.25,
                  borderRadius: "10px",
                  background:
                    pathname === link.href
                      ? "rgba(184,146,42,0.1)"
                      : "transparent",
                  "&:hover": { background: "rgba(184,146,42,0.08)" },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: pathname === link.href ? 600 : 400,
                    fontSize: "0.9375rem",
                    color: pathname === link.href ? T.goldLight : T.inkMuted,
                    lineHeight: 1,
                  }}
                >
                  {link.label}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>

        {/* Bottom actions */}
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 3 }}
        >
          <CurrencySelector isDark={false} />
          <motion.button
            onClick={() => {
              openCart();
              onClose();
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 20px",
              borderRadius: "10px",
              border: `1px solid ${T.drawerBorder}`,
              background: "rgba(184,146,42,0.08)",
              color: T.inkMuted,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "all 0.18s ease",
            }}
          >
            <CartIcon style={{ fontSize: "1rem" }} />
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </motion.button>

          <Link
            href="/book-consultation"
            onClick={onClose}
            style={{ textDecoration: "none" }}
          >
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  py: "12px",
                  borderRadius: "10px",
                  background: `linear-gradient(135deg,${T.gold},${T.goldLight})`,
                  boxShadow: `0 4px 20px ${T.goldGlow}`,
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#1A1712",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Book a free call →
                </Typography>
              </Box>
            </motion.div>
          </Link>
        </Box>
      </Box>
    </Drawer>
  );
}
