export const colorTokens = {
  financeBlue: {
    50: "#EEF4FF",
    100: "#D9E6FF",
    200: "#B3CDFF",
    300: "#7DADFF",
    400: "#4B8BFF",
    500: "#1A56DB",
    600: "#1544C0",
    700: "#1034A0",
    800: "#0C2680",
    900: "#081860",
  },

  
  darkNavy: {
    50: "#E8EAF0",
    100: "#C5CAD8",
    200: "#9DA6BE",
    300: "#7480A3",
    400: "#4F5E8E",
    500: "#2C3E6E",
    600: "#1E2E5A",
    700: "#132046",
    800: "#0A1430",
    900: "#04091A", 
  },


  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },


  success: {
    light: "#ECFDF5",
    main: "#10B981",
    dark: "#065F46",
  },
  warning: {
    light: "#FFFBEB",
    main: "#F59E0B",
    dark: "#92400E",
  },
  error: {
    light: "#FEF2F2",
    main: "#EF4444",
    dark: "#991B1B",
  },
  info: {
    light: "#EFF6FF",
    main: "#3B82F6",
    dark: "#1E40AF",
  },

  white: "#FFFFFF",
  offWhite: "#FAFBFF",
  glassSurface: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
} as const;

export const spacingTokens = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
  "5xl": "128px",
} as const;

export const borderRadiusTokens = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  full: "9999px",
} as const;

export const shadowTokens = {
  sm: "0 1px 3px rgba(10, 20, 48, 0.06), 0 1px 2px rgba(10, 20, 48, 0.04)",
  md: "0 4px 16px rgba(10, 20, 48, 0.08), 0 2px 6px rgba(10, 20, 48, 0.06)",
  lg: "0 8px 32px rgba(10, 20, 48, 0.10), 0 4px 12px rgba(10, 20, 48, 0.08)",
  xl: "0 16px 48px rgba(10, 20, 48, 0.12), 0 8px 20px rgba(10, 20, 48, 0.08)",
  "2xl":
    "0 24px 64px rgba(10, 20, 48, 0.16), 0 12px 28px rgba(10, 20, 48, 0.10)",
  blue: "0 8px 32px rgba(26, 86, 219, 0.24), 0 2px 8px rgba(26, 86, 219, 0.16)",
  blueHover:
    "0 16px 48px rgba(26, 86, 219, 0.32), 0 4px 12px rgba(26, 86, 219, 0.20)",
  glass:
    "0 8px 32px rgba(10, 20, 48, 0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
} as const;

export const transitionTokens = {
  fast: "0.15s ease",
  base: "0.25s ease",
  slow: "0.4s ease",
  spring: "0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const gradientTokens = {
  primaryBlue: "linear-gradient(135deg, #1A56DB 0%, #1034A0 100%)",
  heroMesh: `
    radial-gradient(ellipse at 20% 50%, rgba(26, 86, 219, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(16, 52, 160, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 60% 80%, rgba(26, 86, 219, 0.06) 0%, transparent 60%)
  `,
  cardShimmer:
    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
  darkHero: "linear-gradient(180deg, #04091A 0%, #0A1430 50%, #0C2680 100%)",
  subtleBlue: "linear-gradient(135deg, #EEF4FF 0%, #F8FAFC 100%)",
  footerDark: "linear-gradient(180deg, #0A1430 0%, #04091A 100%)",
} as const;
