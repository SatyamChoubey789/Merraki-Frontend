"use client";

import { useEffect, useState, useRef } from "react";
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
import { MerrakiLogoAnimated } from "@/components/ui/MerrakiLogo/MerrakiLogo";

/* ══════════════════════════════════════════════════════════
   TOKENS — exact match to hero + footer
══════════════════════════════════════════════════════════ */
const T = {
  /* hero bg is #FFFFFF — so "transparent" header over it = white */
  heroBg:     "#FFFFFF",

  ink:        "#0A0A0F",
  inkMid:     "#1E1E2A",
  inkMuted:   "#5A5A72",
  inkFaint:   "#9898AE",

  blue:       "#3B7BF6",
  blueLight:  "#7AABFF",
  bluePale:   "#EDF3FF",
  blueGlow:   "rgba(59,123,246,0.18)",
  blueDim:    "rgba(59,123,246,0.08)",
  blueGrad:   "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",

  border:     "rgba(10,10,20,0.09)",
  drawerBg:   "#FFFFFF",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ══════════════════════════════════════════════════════════
   SCROLL HOOK
   • At top (< 10px)   → header fully visible, no bg (hero white shows through = seamless)
   • Scrolled down     → frosted white appears smoothly
   • Scrolling DOWN    → header hides above viewport
   • Scrolling UP      → header reappears
══════════════════════════════════════════════════════════ */
function useHeaderScroll() {
  const [visible,  setVisible]  = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;

      // scrolled state — triggers bg transition
      setScrolled(y > 50);

      // hide / show
      if (y < 12) {
        setVisible(true);
      } else if (y > lastY.current + 6) {
        setVisible(false);   // going down → hide
      } else if (y < lastY.current - 6) {
        setVisible(true);    // going up  → show
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return { visible, scrolled };
}

function useIsMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/* ══════════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════════ */
export function Header() {
  const pathname   = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMounted  = useIsMounted();
  const { visible, scrolled } = useHeaderScroll();

  const _count  = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openDrawer);
  const itemCount = isMounted ? _count : 0;

  return (
    <>
      {/* ── Slide wrapper ── */}
      <motion.header
        animate={{ y: visible ? 0 : "-110%" }}
        transition={{ duration: 0.38, ease: EASE }}
        style={{ position:"fixed", top:0, left:0, right:0, zIndex:1100 }}
      >
        {/*
          ── Background layer ──
          When NOT scrolled: bg = #FFFFFF (= hero background) with opacity 0
            → header is invisible, merges perfectly with white hero
          When scrolled: bg = rgba(255,255,255,0.92) + blur
            → frosted white panel that still matches the white color system
        */}
        <motion.div
          animate={{
            backgroundColor: scrolled
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0)",
            borderBottomColor: scrolled
              ? "rgba(10,10,20,0.08)"
              : "rgba(10,10,20,0)",
            boxShadow: scrolled
              ? "0 1px 32px rgba(10,10,20,0.07)"
              : "0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            backdropFilter:        scrolled ? "blur(20px) saturate(180%)" : "none",
            WebkitBackdropFilter:  scrolled ? "blur(20px) saturate(180%)" : "none",
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              height:         { xs: 64, md: 70 },
            }}>

              {/* Logo */}
              <Link href="/" style={{ textDecoration:"none", flexShrink:0 }}>
                <MerrakiLogoAnimated variant="color" animate={true} size={100}/>
              </Link>

              {/* Centre nav */}
              <Box component="nav" sx={{
                display:      { xs:"none", lg:"flex" },
                alignItems:   "center",
                gap:          "2px",
                mx:           "auto",
                borderRadius: "100px",
                px:           "6px",
                py:           "5px",
                /* subtle pill container — only visible when transparent (at top)
                   so nav items still pop against the white hero */
                background:   scrolled ? "transparent" : "rgba(10,10,20,0.03)",
                border:       scrolled ? "none" : "1px solid rgba(10,10,20,0.06)",
                transition:   "all 0.28s ease",
              }}>
                {NAV_LINKS.map((link) => (
                  <NavPill
                    key={link.href}
                    link={link}
                    isActive={pathname === link.href}
                  />
                ))}
              </Box>

              {/* Right actions */}
              <Box sx={{ display:"flex", alignItems:"center", gap:0.75, flexShrink:0 }}>
                {/* Cart */}
                <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}>
                  <IconButton onClick={openCart} size="small" sx={{
                    width:36, height:36, borderRadius:"10px",
                    color: T.inkMuted,
                    "&:hover": { background: T.blueDim, color: T.blue },
                    transition: "all 0.18s ease",
                  }}>
                    <Badge badgeContent={itemCount} max={9} sx={{
                      "& .MuiBadge-badge": {
                        background: T.blueGrad,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.5rem",
                        minWidth: 14,
                        height: 14,
                        padding: "0 3px",
                      },
                    }}>
                      <CartIcon sx={{ fontSize:"1.1rem" }} />
                    </Badge>
                  </IconButton>
                </motion.div>

                {/* Book CTA */}
                <Box sx={{ display:{ xs:"none", md:"block" } }}>
                  <BookButton />
                </Box>

                {/* Hamburger */}
                <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}>
                  <IconButton
                    onClick={() => setMobileOpen(true)}
                    size="small"
                    sx={{
                      display: { xs:"flex", lg:"none" },
                      width:36, height:36, borderRadius:"10px",
                      color: T.inkMuted,
                      "&:hover": { background: T.blueDim, color: T.blue },
                      transition: "all 0.18s ease",
                    }}
                  >
                    <MenuIcon sx={{ fontSize:"1.2rem" }} />
                  </IconButton>
                </motion.div>
              </Box>
            </Box>
          </Container>
        </motion.div>
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

/* ══════════════════════════════════════════════════════════
   NAV PILL
══════════════════════════════════════════════════════════ */
function NavPill({
  link,
  isActive,
}: {
  link: { label: string; href: string; badge?: string };
  isActive: boolean;
}) {
  return (
    <Link href={link.href} style={{ textDecoration:"none" }}>
      <Box sx={{
        position:   "relative",
        display:    "flex",
        alignItems: "center",
        gap:        0.6,
        px:         "14px",
        py:         "7px",
        borderRadius: "100px",
        cursor:     "pointer",
        background: isActive ? T.blueDim : "transparent",
        transition: "all 0.18s ease",
        "&:hover":  { background: T.blueDim },
        "&:hover .nav-label": { color: `${T.blue} !important` },
      }}>
        {/* Active dot */}
        {isActive && (
          <Box sx={{
            position:  "absolute",
            bottom:    3,
            left:      "50%",
            transform: "translateX(-50%)",
            width:     4,
            height:    4,
            borderRadius: "50%",
            background: T.blueGrad,
          }} />
        )}
        <Typography className="nav-label" sx={{
          fontFamily: SANS,
          fontWeight: isActive ? 600 : 450,
          fontSize:   "0.875rem",
          color:      isActive ? T.blue : T.inkMuted,
          lineHeight: 1,
          transition: "color 0.18s ease",
          whiteSpace: "nowrap",
        }}>
          {link.label}
        </Typography>
        {link.badge && (
          <Box sx={{
            px:"5px", py:"2px", borderRadius:"5px",
            background: T.blueGrad,
            fontFamily: MONO, fontSize:"0.44rem",
            fontWeight: 700, color:"#FFFFFF", lineHeight:1.5,
          }}>
            {link.badge}
          </Box>
        )}
      </Box>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   BOOK BUTTON — full pill
══════════════════════════════════════════════════════════ */
function BookButton() {
  return (
    <Link href="/book-consultation" style={{ textDecoration:"none" }}>
      <motion.div
        whileHover={{ y:-1, boxShadow:`0 6px 24px ${T.blueGlow}` }}
        whileTap={{ scale:0.97 }}
      >
        <Box sx={{
          display:    "inline-flex",
          alignItems: "center",
          gap:        0.75,
          px:         "20px",
          py:         "9px",
          borderRadius: "100px",
          background:   T.blueGrad,
          boxShadow:    `0 3px 16px ${T.blueGlow}`,
          cursor:       "pointer",
          transition:   "all 0.22s ease",
          "&:hover":    { filter:"brightness(1.07)" },
        }}>
          <Typography sx={{
            fontFamily:    SANS,
            fontWeight:    700,
            fontSize:      "0.85rem",
            color:         "#FFFFFF",
            lineHeight:    1,
            whiteSpace:    "nowrap",
            letterSpacing: "-0.01em",
          }}>
            Book a call
          </Typography>
          <Typography sx={{
            fontFamily: MONO,
            fontSize:   "0.75rem",
            color:      "rgba(255,255,255,0.7)",
            lineHeight: 1,
          }}>
            →
          </Typography>
        </Box>
      </motion.div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   MOBILE DRAWER
══════════════════════════════════════════════════════════ */
function MobileDrawer({
  open, onClose, pathname, itemCount, openCart,
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
          width:        300,
          background:   T.drawerBg,
          borderLeft:   `1px solid ${T.border}`,
          boxShadow:    "-20px 0 80px rgba(0,0,0,0.07)",
        },
      }}
    >
      <Box sx={{ p:3, height:"100%", display:"flex", flexDirection:"column" }}>

        {/* Header row */}
        <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", mb:4 }}>
          <MerrakiLogoAnimated variant="color" animate={false} />
          <IconButton onClick={onClose} size="small" sx={{
            width:34, height:34, borderRadius:"9px",
            color: T.inkMuted, border:`1px solid ${T.border}`,
            "&:hover": { color:T.blue, borderColor:T.blue, background:T.blueDim },
          }}>
            <CloseIcon sx={{ fontSize:"1rem" }} />
          </IconButton>
        </Box>

        {/* Nav links */}
        <Box sx={{ flex:1, display:"flex", flexDirection:"column", gap:0.5 }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose}
              style={{ textDecoration:"none" }}>
              <Box sx={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                px:1.75, py:1.25, borderRadius:"100px",
                background: pathname === link.href ? T.blueDim : "transparent",
                "&:hover":  { background: T.blueDim },
              }}>
                <Typography sx={{
                  fontFamily: SANS,
                  fontWeight: pathname === link.href ? 600 : 400,
                  fontSize:   "0.9375rem",
                  color:      pathname === link.href ? T.blue : T.inkMuted,
                  lineHeight: 1,
                }}>
                  {link.label}
                </Typography>
                {pathname === link.href && (
                  <Box sx={{ width:6, height:6, borderRadius:"50%", background:T.blueGrad }} />
                )}
              </Box>
            </Link>
          ))}
        </Box>

        {/* Bottom actions */}
        <Box sx={{ display:"flex", flexDirection:"column", gap:1.25, mt:3 }}>

          <motion.button
            onClick={() => { openCart(); onClose(); }}
            whileHover={{ scale:1.01 }}
            whileTap={{ scale:0.98 }}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              gap:8, padding:"11px 20px", borderRadius:"100px",
              border:`1px solid ${T.border}`,
              background: T.bluePale, color: T.blue,
              fontFamily: SANS, fontWeight:500, fontSize:"0.875rem",
              cursor:"pointer", transition:"all 0.18s ease",
            }}
          >
            <CartIcon style={{ fontSize:"1rem" }} />
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </motion.button>

          <Link href="/book-consultation" onClick={onClose} style={{ textDecoration:"none" }}>
            <motion.div whileHover={{ y:-1 }} whileTap={{ scale:0.98 }}>
              <Box sx={{
                display:"flex", alignItems:"center", justifyContent:"center",
                gap:1, py:"12px", borderRadius:"100px",
                background:   T.blueGrad,
                boxShadow:    `0 4px 20px ${T.blueGlow}`,
                cursor:       "pointer",
              }}>
                <Typography sx={{
                  fontFamily:    SANS,
                  fontWeight:    700,
                  fontSize:      "0.875rem",
                  color:         "#FFFFFF",
                  letterSpacing: "-0.01em",
                }}>
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