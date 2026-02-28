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
} from "@mui/icons-material";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { colorTokens, shadowTokens } from "@/theme";
import { NAV_LINKS } from "./navLinks";
import { useCartStore } from "@/lib/stores/cartStore";
import { CurrencySelector } from "../CurrencySelector/CurrencySelector";
import { MerrakiLogo } from "@/components/ui/MerrakiLogo/MerrakiLogo";

const MotionAppBar = motion.create(AppBar);

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openDrawer);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  const isHomePage = pathname === "/";
  const isDarkBg = isHomePage && !scrolled;

  const bgColor = scrolled
    ? "rgba(255,255,255,0.92)"
    : isHomePage
      ? "rgba(10,15,30,0.35)"
      : "rgba(255,255,255,0.92)";

  const backdropFilter = scrolled
    ? "blur(20px) saturate(180%)"
    : isHomePage
      ? "blur(8px)"
      : "blur(20px) saturate(180%)";

  const borderBottom = scrolled
    ? `1px solid ${colorTokens.slate[100]}`
    : isHomePage
      ? "1px solid rgba(255,255,255,0.08)"
      : `1px solid ${colorTokens.slate[100]}`;

  return (
    <>
      <MotionAppBar
        position="fixed"
        elevation={0}
        animate={{
          backgroundColor: bgColor,
          backdropFilter,
          borderBottom,
          boxShadow: scrolled ? shadowTokens.md : "none",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        sx={{ zIndex: 1100 }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: { xs: 64, md: 72 },
              gap: 2,
            }}
          >
            {/* ── Logo ─────────────────────────────────────────────── */}
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <motion.div
                whileHover={{
                  scale: 1.04,
                  filter: isDarkBg
                    ? "drop-shadow(0 0 12px rgba(255,255,255,0.4))"
                    : "drop-shadow(0 0 12px rgba(26,86,219,0.45))",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <MerrakiLogo
                  variant={isDarkBg ? "white" : "color"}
                  width={100}
                  animate={false}
                />
              </motion.div>
            </Link>

            {/* ── Desktop Nav ───────────────────────────────────────── */}
            <Box
              component="nav"
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  isActive={pathname === link.href}
                  isDark={isDarkBg}
                />
              ))}
            </Box>

            {/* ── Right Actions ─────────────────────────────────────── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <CurrencySelector isDark={isDarkBg} />
              </Box>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={openCart}
                  sx={{
                    color: isDarkBg ? "rgba(255,255,255,0.9)" : colorTokens.slate[700],
                    transition: "color 0.3s ease",
                    "&:hover": {
                      backgroundColor: isDarkBg
                        ? "rgba(255,255,255,0.1)"
                        : colorTokens.slate[100],
                    },
                  }}
                >
                  <Badge
                    badgeContent={itemCount}
                    color="primary"
                    max={9}
                    sx={{
                      "& .MuiBadge-badge": {
                        background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.625rem",
                        minWidth: 16,
                        height: 16,
                        padding: "0 3px",
                      },
                    }}
                  >
                    <CartIcon sx={{ fontSize: "1.375rem" }} />
                  </Badge>
                </IconButton>
              </motion.div>

              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    component={Link}
                    href="/book-consultation"
                    variant="contained"
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                      color: "#fff",
                      px: 2.5,
                      py: 1,
                      fontSize: "0.875rem",
                      boxShadow: "0 4px 14px rgba(26,86,219,0.3)",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(26,86,219,0.4)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Book Consultation
                  </Button>
                </motion.div>
              </Box>

              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  display: { xs: "flex", lg: "none" },
                  color: isDarkBg ? "rgba(255,255,255,0.9)" : colorTokens.slate[700],
                  transition: "color 0.3s ease",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </MotionAppBar>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

// ─── Nav Item ────────────────────────────────────────────────────────────────

interface NavItemProps {
  link: { label: string; href: string; badge?: string };
  isActive: boolean;
  isDark: boolean;
}

function NavItem({ link, isActive, isDark }: NavItemProps) {
  return (
    <Link href={link.href} style={{ textDecoration: "none", position: "relative" }}>
      <motion.div whileHover="hover" initial="rest" animate="rest">
        <Box
          sx={{
            position: "relative",
            px: 1.5,
            py: 1,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: isDark ? "rgba(255,255,255,0.08)" : colorTokens.slate[50],
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: isActive ? 600 : 500,
              fontSize: "0.9375rem",
              color: isDark
                ? isActive ? "#fff" : "rgba(255,255,255,0.8)"
                : isActive ? colorTokens.financeBlue[600] : colorTokens.slate[700],
              transition: "color 0.3s ease",
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
                background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.04em",
                lineHeight: 1.4,
              }}
            >
              {link.badge}
            </Box>
          )}
        </Box>
        {isActive && (
          <motion.div
            layoutId="nav-active"
            style={{
              position: "absolute",
              bottom: -2,
              left: "50%",
              translateX: "-50%",
              width: "60%",
              height: 2,
              background: `linear-gradient(90deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
              borderRadius: "999px",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
}

// ─── Mobile Drawer ───────────────────────────────────────────────────────────

function MobileNavDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openDrawer);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          borderRadius: "20px 0 0 20px",
          background: colorTokens.white,
          boxShadow: shadowTokens["2xl"],
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <MerrakiLogo variant="color" width={88} animate={false} />
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ backgroundColor: colorTokens.slate[100], "&:hover": { backgroundColor: colorTokens.slate[200] } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : 20 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={onClose}
                  selected={pathname === link.href}
                  sx={{
                    borderRadius: "10px",
                    py: 1.25,
                    px: 2,
                    "&.Mui-selected": {
                      backgroundColor: colorTokens.financeBlue[50],
                      "& .MuiListItemText-primary": { fontWeight: 600, color: colorTokens.financeBlue[700] },
                    },
                    "&:hover": { backgroundColor: colorTokens.slate[50] },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "0.9375rem",
                      color: colorTokens.slate[800],
                    }}
                  />
                  {link.badge && (
                    <Box
                      sx={{
                        px: "8px",
                        py: "3px",
                        borderRadius: "5px",
                        background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#fff",
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

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <CurrencySelector isDark={false} fullWidth />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CartIcon />}
            onClick={() => { openCart(); onClose(); }}
            fullWidth
            sx={{ borderRadius: "10px", py: 1.25 }}
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </Button>
          <Button
            component={Link}
            href="/book-consultation"
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{
              borderRadius: "10px",
              py: 1.25,
              background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
              boxShadow: "0 4px 14px rgba(26,86,219,0.3)",
            }}
          >
            Book Consultation
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}