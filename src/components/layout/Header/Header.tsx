"use client";

import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import {
  ShoppingCart as CartIcon,
  KeyboardArrowDown as DropdownIcon,
} from "@mui/icons-material";
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

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cart store
  const openDrawer = useCartStore((s) => s.openDrawer);
  const itemCount = useCartStore((s) => s.items.length);

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
    closeTimer.current = setTimeout(() => setOpenMenu(null), 100);
  };

  const onDropdownEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
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
        <Link href="/" style={{ textDecoration: "none" }}>
          <MerrakiTextLogoAnimated size="md" color={T.ink} />
        </Link>

        {/* NAV */}
        <Box
          component="nav"
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "36px",
          }}
        >
          {NAV_LINKS.map((link) => {
            const hasDropdown = !!link.children?.length;

            const isActive =
              link.href &&
              (pathname === link.href || pathname.startsWith(link.href + "/"));

            const isOpen = openMenu === link.label;

            return (
              <Box
                key={link.label}
                onMouseEnter={() => hasDropdown && onEnter(link.label)}
                onMouseLeave={() => hasDropdown && onLeave()}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  height: "70px",
                }}
              >
                {/* NAV ITEM */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: SANS,
                        fontSize: "0.92rem",
                        fontWeight: 500,
                        color: isActive ? T.ink : T.inkMuted,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        lineHeight: 1,
                      }}
                    >
                      {hasDropdown && (
                        <DropdownIcon
                          sx={{
                            fontSize: 18,
                            transition: "0.2s ease",
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      )}

                      {link.label}
                    </Link>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: T.inkMuted,
                        fontFamily: SANS,
                        fontSize: "0.92rem",
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      {hasDropdown && (
                        <DropdownIcon
                          sx={{
                            fontSize: 18,
                            transition: "0.2s ease",
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      )}

                      {link.label}
                    </Box>
                  )}
                </Box>

                {/* DROPDOWN */}
                {hasDropdown && isOpen && (
                  <Box
                    onMouseEnter={onDropdownEnter}
                    onMouseLeave={onLeave}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: "220px",
                      background: T.card,
                      border: `1px solid ${T.border}`,
                      borderRadius: "10px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      zIndex: 999,
                      py: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    {link.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href!}
                        style={{
                          fontFamily: SANS,
                          fontSize: "0.88rem",
                          color: T.ink,
                          textDecoration: "none",
                          padding: "10px 14px",
                          transition: "0.2s ease",
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
          {/* CART BUTTON */}
          <Box
            onClick={openDrawer}
            sx={{
              position: "relative",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: T.ink,
            }}
          >
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

          {/* CONTACT BUTTON */}
          <Link href="/book-consultation" style={{ textDecoration: "none" }}>
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
        </Box>
      </Box>
    </Box>
  );
}
