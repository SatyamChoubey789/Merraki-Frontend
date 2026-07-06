"use client";

import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Drawer, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ShoppingCart as CartIcon } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MerrakiTextLogoAnimated } from "@/components/ui/Merrakitextlogo";
import { useCartStore } from "@/lib/stores/cartStore";

const T = {
  bg: "#F5F7FB",
  ink: "#253957",
  inkMuted: "rgba(37,57,87,0.6)",
  border: "rgba(37,57,87,0.08)",
  card: "#FFFFFF",
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

export interface NavLink {
  label: string;
  href?: string;
  children?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Virtual CFO", href: "/VirtualCFO" },
      { label: "Financial Modelling", href: "/Financial-Modelling" },
      { label: "Valuation", href: "/Valuation" },
      { label: "Pitch Decks", href: "/PitchDeck" },
      { label: "Data Analysis", href: "/DataAnalysis" },
      { label: "Templates & Calculators", href: "/TemplatesCalculators" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Templates", href: "/templates" },
      { label: "Calculators", href: "/calculators" },
      { label: "Founder's Test", href: "/founder-test" },
    ],
  },
  { label: "Plans", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // desktop dropdown
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  // mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const openDrawer = useCartStore((s) => s.openDrawer);
  const itemCount = useCartStore((s) => s.items.length);

  // scroll hide header
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current <= 60 || current < lastScrollY.current);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // desktop hover
  const onEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const onLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const onDropdownEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // mobile accordion
  const toggleExpand = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* HEADER */}
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, md: 4 },
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <Link href="/">
            <MerrakiTextLogoAnimated size="md" color={T.ink} />
          </Link>

          {/* DESKTOP NAV */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "32px",
            }}
          >
            {NAV_LINKS.map((link) => {
              const hasDropdown = !!link.children?.length;
              const isOpen = openMenu === link.label;
              const active = isActive(link.href);

              return (
                <Box
                  key={link.label}
                  onMouseEnter={() => hasDropdown && onEnter(link.label)}
                  onMouseLeave={() => hasDropdown && onLeave()}
                  sx={{ position: "relative", height: "70px", display: "flex", alignItems: "center" }}
                >
                  <Link
                    href={link.href || "#"}
                    style={{
                      fontFamily: SANS,
                      fontSize: "0.92rem",
                      fontWeight: 500,
                      color: active ? T.ink : T.inkMuted,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {link.label}

                    {hasDropdown && (
                      <ExpandMoreIcon
                        sx={{
                          fontSize: 18,
                          transition: "0.2s",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    )}
                  </Link>

                  {/* DROPDOWN */}
                  {hasDropdown && isOpen && (
                    <Box
                      onMouseEnter={onDropdownEnter}
                      onMouseLeave={onLeave}
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        minWidth: 220,
                        background: T.card,
                        border: `1px solid ${T.border}`,
                        borderRadius: "12px",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                        py: 1,
                        zIndex: 9999,
                      }}
                    >
                      {link.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href!}
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            fontFamily: SANS,
                            fontSize: "0.88rem",
                            color: T.ink,
                            textDecoration: "none",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* CART */}
            <Box onClick={openDrawer} sx={{ position: "relative", cursor: "pointer" }}>
              <CartIcon />
              {itemCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -8,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: T.ink,
                    color: "#fff",
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {itemCount}
                </Box>
              )}
            </Box>

            {/* CONTACT */}
            <Link href="/book-consultation">
              <button
                style={{
                  border: `1px solid ${T.ink}`,
                  color: T.ink,
                  background: "transparent",
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Contact
              </button>
            </Link>

            {/* MOBILE HAMBURGER */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "flex", md: "none" }, color: T.ink }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: "85vw",
            backdropFilter: "blur(18px)",
            background: "rgba(245,247,251,0.92)",
            px: 2,
            py: 2,
          },
        }}
      >
        {/* CLOSE */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* LINKS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV_LINKS.map((link) => {
            const hasChildren = !!link.children?.length;
            const active = isActive(link.href);

            return (
              <Box key={link.label}>
                <Box
                  onClick={() =>
                    hasChildren
                      ? toggleExpand(link.label)
                      : setMobileOpen(false)
                  }
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1.5,
                    fontFamily: SANS,
                    fontWeight: 500,
                    color: active ? T.ink : T.inkMuted,
                    cursor: "pointer",
                  }}
                >
                  <Link href={link.href || "#"}>{link.label}</Link>
                  {hasChildren && (
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          expanded === link.label
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    />
                  )}
                </Box>

                <Collapse in={expanded === link.label}>
                  <Box sx={{ pl: 2 }}>
                    {link.children?.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href!}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: "block",
                          padding: "8px 0",
                          fontFamily: SANS,
                          fontSize: "0.9rem",
                          color: T.inkMuted,
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Drawer>
    </>
  );
}