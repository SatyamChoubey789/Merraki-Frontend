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
import { useCartTotalItems, useCartActions } from "@/lib/stores/useCartStore";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMuted: "rgba(37,57,87,0.6)",
  inkFaint: "rgba(37,57,87,0.4)",
  border: "rgba(37,57,87,0.08)",
  borderMid: "rgba(37,57,87,0.14)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;

// ─── Nav config ───────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname();

  // Cart — connected to real store
  const totalItems = useCartTotalItems();
  const { openCart } = useCartActions();

  // Scroll hide
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Desktop dropdown
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current <= 60 || current < lastScrollY.current);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const toggleExpand = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
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
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <MerrakiTextLogoAnimated size="md" color={T.ink} />
          </Link>

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "28px",
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
                  sx={{
                    position: "relative",
                    height: 70,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href={link.href || "#"}
                    style={{
                      fontFamily: SANS,
                      fontSize: "0.9rem",
                      fontWeight: active ? 600 : 500,
                      color: active ? T.ink : T.inkMuted,
                      textDecoration: "none",      // no underline ever
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {link.label}
                    {hasDropdown && (
                      <ExpandMoreIcon
                        sx={{
                          fontSize: 16,
                          transition: "transform 0.2s",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          color: T.inkFaint,
                        }}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {hasDropdown && isOpen && (
                    <Box
                      onMouseEnter={onDropdownEnter}
                      onMouseLeave={onLeave}
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        minWidth: 210,
                        background: T.surface,
                        border: `1px solid ${T.borderMid}`,
                        borderRadius: "12px",
                        boxShadow: "0 12px 40px rgba(37,57,87,0.10)",
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
                            padding: "9px 14px",
                            fontFamily: SANS,
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            color: T.ink,
                            textDecoration: "none",   // no underline
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(37,57,87,0.04)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
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

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Cart button — connected to store */}
            <Box
              component="button"
              onClick={openCart}
              aria-label={`Open cart (${totalItems} items)`}
              sx={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: "9px",
                border: `1px solid ${T.border}`,
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s",
                "&:hover": {
                  background: "rgba(37,57,87,0.05)",
                  borderColor: T.borderMid,
                },
              }}
            >
              <CartIcon sx={{ fontSize: "1.1rem", color: T.ink }} />

              {/* Badge — brand ink color, only shown when items > 0 */}
              {totalItems > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    minWidth: 16,
                    height: 16,
                    px: "3px",
                    borderRadius: "100px",
                    background: T.ink,          // brand #253957, NOT blue
                    border: `1.5px solid ${T.bg}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Contact CTA */}
            <Link href="/book-consultation" style={{ textDecoration: "none" }}>
              <Box
                component="button"
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  px: 2,
                  py: "8px",
                  border: `1.5px solid ${T.ink}`,
                  borderRadius: "9px",
                  background: "transparent",
                  color: T.ink,
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s",
                  "&:hover": { background: "rgba(37,57,87,0.05)" },
                }}
              >
                Contact
              </Box>
            </Link>

            {/* Mobile hamburger */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: T.ink,
                width: 38,
                height: 38,
                borderRadius: "9px",
                border: `1px solid ${T.border}`,
              }}
            >
              <MenuIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* ── Mobile drawer ── */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: "82vw",
            maxWidth: 340,
            background: T.bg,
            px: 2.5,
            py: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              border: `1px solid ${T.border}`,
              color: T.inkMuted,
            }}
          >
            <CloseIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>

        {/* Links */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {NAV_LINKS.map((link) => {
            const hasChildren = !!link.children?.length;
            const active = isActive(link.href);
            const isExpanded = expanded === link.label;

            return (
              <Box
                key={link.label}
                sx={{ borderBottom: `1px solid ${T.border}` }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    hasChildren
                      ? toggleExpand(link.label)
                      : setMobileOpen(false)
                  }
                >
                  {/* FIX: Link is NOT a child of the clickable Box to avoid
                      nested click conflicts. Styled directly, no underline. */}
                  <Link
                    href={link.href || "#"}
                    style={{
                      fontFamily: SANS,
                      fontWeight: active ? 600 : 500,
                      fontSize: "0.9375rem",
                      color: active ? T.ink : T.inkMuted,
                      textDecoration: "none",    // ← removes blue underline
                    }}
                    onClick={(e) => {
                      // If has children, prevent navigation — just toggle accordion
                      if (hasChildren) e.preventDefault();
                      else setMobileOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>

                  {hasChildren && (
                    <ExpandMoreIcon
                      sx={{
                        fontSize: "1.1rem",
                        color: T.inkFaint,
                        transition: "transform 0.2s",
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  )}
                </Box>

                {/* Accordion children */}
                <Collapse in={isExpanded}>
                  <Box sx={{ pl: 2, pb: 1.5 }}>
                    {link.children?.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href!}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: "block",
                          padding: "7px 0",
                          fontFamily: SANS,
                          fontSize: "0.875rem",
                          fontWeight: 400,
                          color: T.inkMuted,
                          textDecoration: "none",    // ← removes blue underline
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

        {/* Mobile CTA at bottom */}
        <Box sx={{ mt: "auto", pt: 3 }}>
          <Link
            href="/book-consultation"
            onClick={() => setMobileOpen(false)}
            style={{ textDecoration: "none" }}
          >
            <Box
              component="button"
              sx={{
                width: "100%",
                py: "11px",
                borderRadius: "10px",
                border: `1.5px solid ${T.ink}`,
                background: "transparent",
                color: T.ink,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "background 0.15s",
                "&:hover": { background: "rgba(37,57,87,0.05)" },
              }}
            >
              Book a consultation
            </Box>
          </Link>
        </Box>
      </Drawer>
    </>
  );
}