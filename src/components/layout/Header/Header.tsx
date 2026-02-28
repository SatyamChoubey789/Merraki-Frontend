"use client";

import { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  KeyboardArrowDown as ChevronIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./navLinks";
import { useCartStore } from "@/lib/stores/cartStore";
import { CurrencySelector } from "../CurrencySelector/CurrencySelector";
import { MerrakiLogo } from "@/components/ui/MerrakiLogo/MerrakiLogo";

/* ── tokens ──────────────────────────────────────────────────────────── */
const T = {
  bg:          "#FFFFFF",
  bgDark:      "rgba(10,12,16,0.55)",
  border:      "#E8EAED",
  borderDark:  "rgba(255,255,255,0.09)",
  ink:         "#0F1117",
  inkMid:      "#374151",
  inkMuted:    "#6B7280",
  inkDark:     "rgba(255,255,255,0.82)",
  inkMutedDark:"rgba(255,255,255,0.5)",
  accent:      "#0057FF",
  accentHov:   "#0041CC",
  hover:       "rgba(15,17,23,0.04)",
  hoverDark:   "rgba(255,255,255,0.06)",
};

const FONT_BODY    = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const FONT_MONO    = `"DM Mono", "JetBrains Mono", monospace`;

const MotionAppBar = motion.create(AppBar);

/* ══════════════════════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════════════════════ */
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart  = useCartStore((s) => s.openDrawer);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  const isHomePage = pathname === "/";
  const isDark     = isHomePage && !scrolled;

  /* animated bar styles */
  const barBg     = scrolled ? T.bg : isHomePage ? T.bgDark : T.bg;
  const barBorder = scrolled
    ? `1px solid ${T.border}`
    : isHomePage ? `1px solid ${T.borderDark}` : `1px solid ${T.border}`;
  const barShadow = scrolled ? "0 1px 0 rgba(15,17,23,0.06), 0 4px 16px rgba(15,17,23,0.04)" : "none";

  return (
    <>
      <MotionAppBar
        position="fixed"
        elevation={0}
        animate={{
          backgroundColor: barBg,
          backdropFilter: "blur(20px) saturate(200%)",
          borderBottom: barBorder,
          boxShadow: barShadow,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        sx={{ zIndex: 1100, fontFamily: FONT_BODY }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: { xs: 60, md: 66 },
              gap: 2,
            }}
          >

            {/* ── Logo ──────────────────────────────────────────────── */}
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <motion.div
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <MerrakiLogo
                  variant={isDark ? "white" : "color"}
                  width={96}
                  animate={false}
                />
              </motion.div>
            </Link>

            {/* ── Desktop Nav (centre) ───────────────────────────────── */}
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
                  isDark={isDark}
                />
              ))}
            </Box>

            {/* ── Right Actions ─────────────────────────────────────── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>

              {/* Currency */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <CurrencySelector isDark={isDark} />
              </Box>

              {/* Cart */}
              <IconButton
                onClick={openCart}
                size="small"
                sx={{
                  color: isDark ? T.inkDark : T.inkMid,
                  width: 36, height: 36,
                  borderRadius: "8px",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    background: isDark ? T.hoverDark : T.hover,
                    color: isDark ? "#fff" : T.ink,
                  },
                }}
              >
                <Badge
                  badgeContent={itemCount}
                  max={9}
                  sx={{
                    "& .MuiBadge-badge": {
                      background: T.accent,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.55rem",
                      minWidth: 15,
                      height: 15,
                      padding: "0 3px",
                    },
                  }}
                >
                  <CartIcon sx={{ fontSize: "1.2rem" }} />
                </Badge>
              </IconButton>

              {/* Book CTA — Capchase-style bordered pill */}
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, ml: 0.5 }}>

                {/* Ghost "Log in" link */}
                <Button
                  component={Link}
                  href="/login"
                  disableElevation
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: isDark ? T.inkDark : T.inkMid,
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    px: 1.75,
                    py: 0.75,
                    borderRadius: "8px",
                    minWidth: "auto",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      background: isDark ? T.hoverDark : T.hover,
                      color: isDark ? "#fff" : T.ink,
                    },
                  }}
                >
                  Log in
                </Button>

                {/* Bordered "Book a call" */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    component={Link}
                    href="/book-consultation"
                    disableElevation
                    endIcon={<ArrowIcon sx={{ fontSize: "0.85rem !important" }} />}
                    sx={{
                      fontFamily: FONT_BODY,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: isDark ? "#fff" : T.ink,
                      textTransform: "none",
                      letterSpacing: "-0.01em",
                      px: 2,
                      py: 0.875,
                      borderRadius: "8px",
                      border: `1.5px solid ${isDark ? "rgba(255,255,255,0.25)" : T.ink}`,
                      background: "transparent",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        background: isDark ? "rgba(255,255,255,0.08)" : T.ink,
                        color: isDark ? "#fff" : "#fff",
                        borderColor: isDark ? "rgba(255,255,255,0.4)" : T.ink,
                      },
                    }}
                  >
                    Book a call
                  </Button>
                </motion.div>
              </Box>

              {/* Hamburger */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                size="small"
                sx={{
                  display: { xs: "flex", lg: "none" },
                  color: isDark ? T.inkDark : T.inkMid,
                  width: 36, height: 36,
                  borderRadius: "8px",
                  ml: 0.5,
                  "&:hover": { background: isDark ? T.hoverDark : T.hover },
                }}
              >
                <MenuIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </MotionAppBar>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        itemCount={itemCount}
        openCart={openCart}
      />
    </>
  );
}

/* ─── Nav Item ────────────────────────────────────────────────────────── */
interface NavItemProps {
  link: { label: string; href: string; badge?: string };
  isActive: boolean;
  isDark: boolean;
}

function NavItem({ link, isActive, isDark }: NavItemProps) {
  return (
    <Link href={link.href} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          position: "relative",
          px: 1.5,
          py: 0.875,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          transition: "background 0.15s ease",
          "&:hover": {
            background: isDark ? T.hoverDark : T.hover,
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_BODY,
            fontWeight: isActive ? 600 : 450,
            fontSize: "0.9rem",
            letterSpacing: "-0.01em",
            color: isDark
              ? isActive ? "#fff" : T.inkDark
              : isActive ? T.ink : T.inkMid,
            transition: "color 0.15s ease",
            lineHeight: 1,
          }}
        >
          {link.label}
        </Typography>

        {link.badge && (
          <Box
            sx={{
              px: "6px",
              py: "2px",
              borderRadius: "4px",
              background: T.accent,
              fontSize: "0.55rem",
              fontFamily: FONT_MONO,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.06em",
              lineHeight: 1.5,
            }}
          >
            {link.badge}
          </Box>
        )}

        {/* active underline dot */}
        {isActive && (
          <motion.span
            layoutId="nav-active-dot"
            style={{
              position: "absolute",
              bottom: -1,
              left: "50%",
              translateX: "-50%",
              width: 16,
              height: 2,
              background: T.accent,
              borderRadius: "999px",
              display: "block",
            }}
          />
        )}
      </Box>
    </Link>
  );
}

/* ─── Mobile Drawer ────────────────────────────────────────────────────── */
function MobileNavDrawer({
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
          width: 288,
          background: "#fff",
          boxShadow: "-8px 0 40px rgba(15,17,23,0.12)",
          borderLeft: `1px solid ${T.border}`,
        },
      }}
    >
      <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>

        {/* top row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <MerrakiLogo variant="color" width={84} animate={false} />
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: T.inkMid,
              width: 32, height: 32,
              border: `1px solid ${T.border}`,
              borderRadius: "8px",
              "&:hover": { background: T.hover },
            }}
          >
            <CloseIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: T.border, mb: 1.5 }} />

        {/* nav links */}
        <List disablePadding sx={{ flex: 1 }}>
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : 16 }}
              transition={{ delay: i * 0.04, duration: 0.28 }}
            >
              <ListItem disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={onClose}
                  selected={pathname === link.href}
                  sx={{
                    borderRadius: "8px",
                    py: 1.125,
                    px: 1.5,
                    "&.Mui-selected": {
                      background: "rgba(0,87,255,0.05)",
                      "& .MuiListItemText-primary": {
                        fontWeight: 600,
                        color: T.accent,
                      },
                    },
                    "&:hover": { background: T.hover },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontFamily: FONT_BODY,
                      fontWeight: 450,
                      fontSize: "0.9375rem",
                      letterSpacing: "-0.01em",
                      color: T.inkMid,
                    }}
                  />
                  {link.badge && (
                    <Box
                      sx={{
                        px: "7px",
                        py: "2.5px",
                        borderRadius: "4px",
                        background: T.accent,
                        fontSize: "0.55rem",
                        fontFamily: FONT_MONO,
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {link.badge}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Divider sx={{ borderColor: T.border, my: 2 }} />

        {/* bottom actions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <CurrencySelector isDark={false} fullWidth />

          <Button
            variant="outlined"
            startIcon={<CartIcon sx={{ fontSize: "1rem !important" }} />}
            onClick={() => { openCart(); onClose(); }}
            fullWidth
            sx={{
              fontFamily: FONT_BODY,
              fontWeight: 500,
              fontSize: "0.875rem",
              textTransform: "none",
              letterSpacing: "-0.01em",
              borderRadius: "8px",
              py: 1.125,
              color: T.inkMid,
              borderColor: T.border,
              "&:hover": { borderColor: T.ink, color: T.ink, background: T.hover },
            }}
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </Button>

          <Button
            component={Link}
            href="/book-consultation"
            onClick={onClose}
            fullWidth
            disableElevation
            endIcon={<ArrowIcon sx={{ fontSize: "0.9rem !important" }} />}
            sx={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              letterSpacing: "-0.01em",
              borderRadius: "8px",
              py: 1.125,
              color: "#fff",
              background: T.ink,
              border: `1.5px solid ${T.ink}`,
              "&:hover": { background: "#1B2030" },
            }}
          >
            Book a call
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}