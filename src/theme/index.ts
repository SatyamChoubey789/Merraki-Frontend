import { createTheme } from "@mui/material/styles";
import { colorTokens, shadowTokens, borderRadiusTokens } from "./tokens";
import { components } from "./components";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      lightest: colorTokens.financeBlue[50],
      lighter: colorTokens.financeBlue[100],
      light: colorTokens.financeBlue[300],
      main: colorTokens.financeBlue[500],
      dark: colorTokens.financeBlue[700],
      darker: colorTokens.financeBlue[900],
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: colorTokens.darkNavy[400],
      main: colorTokens.darkNavy[700],
      dark: colorTokens.darkNavy[900],
      contrastText: "#FFFFFF",
    },
    success: {
      light: colorTokens.success.light,
      main: colorTokens.success.main,
      dark: colorTokens.success.dark,
    },
    warning: {
      light: colorTokens.warning.light,
      main: colorTokens.warning.main,
      dark: colorTokens.warning.dark,
    },
    error: {
      light: colorTokens.error.light,
      main: colorTokens.error.main,
      dark: colorTokens.error.dark,
    },
    info: {
      light: colorTokens.info.light,
      main: colorTokens.info.main,
      dark: colorTokens.info.dark,
    },
    grey: {
      50: colorTokens.slate[50],
      100: colorTokens.slate[100],
      200: colorTokens.slate[200],
      300: colorTokens.slate[300],
      400: colorTokens.slate[400],
      500: colorTokens.slate[500],
      600: colorTokens.slate[600],
      700: colorTokens.slate[700],
      800: colorTokens.slate[800],
      900: colorTokens.slate[900],
    },
    background: {
      default: colorTokens.white,
      paper: colorTokens.white,
    },
    text: {
      primary: colorTokens.slate[900],
      secondary: colorTokens.slate[600],
      disabled: colorTokens.slate[400],
    },
    divider: colorTokens.slate[100],
  },

  typography: {
    fontFamily: 'var(--font-body), "IBM Plex Sans", system-ui, sans-serif',
    h1: {
      fontFamily: 'var(--font-display), "DM Sans", system-ui, sans-serif',
      fontWeight: 800,
      fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: 'var(--font-display), "DM Sans", system-ui, sans-serif',
      fontWeight: 700,
      fontSize: "clamp(2rem, 4vw, 3rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontFamily: 'var(--font-display), "DM Sans", system-ui, sans-serif',
      fontWeight: 700,
      fontSize: "clamp(1.5rem, 3vw, 2rem)",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: 'var(--font-display), "DM Sans", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
      lineHeight: 1.3,
      letterSpacing: "-0.015em",
    },
    h5: {
      fontFamily: 'var(--font-display), "DM Sans", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontFamily: 'var(--font-display), "DM Sans", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontFamily: 'var(--font-body), "IBM Plex Sans", system-ui, sans-serif',
      fontWeight: 500,
      fontSize: "1.125rem",
      lineHeight: 1.6,
      letterSpacing: "-0.005em",
    },
    subtitle2: {
      fontFamily: 'var(--font-body), "IBM Plex Sans", system-ui, sans-serif',
      fontWeight: 500,
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      letterSpacing: "0em",
    },
    body1: {
      fontFamily: 'var(--font-body), "IBM Plex Sans", system-ui, sans-serif',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.7,
      letterSpacing: "0em",
    },
    body2: {
      fontFamily: 'var(--font-body), "IBM Plex Sans", system-ui, sans-serif',
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    button: {
      fontFamily: 'var(--font-display), "DM Sans", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: "0.9375rem",
      lineHeight: 1,
      letterSpacing: "-0.01em",
      textTransform: "none",
    },
    caption: {
      fontFamily: 'var(--font-body), "IBM Plex Sans", system-ui, sans-serif',
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
    overline: {
      fontFamily: 'var(--font-body), "IBM Plex Sans", system-ui, sans-serif',
      fontWeight: 600,
      fontSize: "0.6875rem",
      lineHeight: 1.5,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
  },

  components,

  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    shadowTokens.sm,
    shadowTokens.sm,
    shadowTokens.md,
    shadowTokens.md,
    shadowTokens.lg,
    shadowTokens.lg,
    shadowTokens.xl,
    shadowTokens.xl,
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
    shadowTokens["2xl"],
  ],
  spacing: 8,
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});

declare module "@mui/material/styles" {
  interface PaletteColor {
    lightest?: string;
    lighter?: string;
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    lightest?: string;
    lighter?: string;
    darker?: string;
  }
}

export { colorTokens, shadowTokens, borderRadiusTokens };
export type AppTheme = typeof theme;