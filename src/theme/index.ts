import { createTheme, alpha } from "@mui/material/styles";
import { colorTokens, shadowTokens, borderRadiusTokens } from "./tokens";
import { typography } from "./typography";
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
  typography,
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
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
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

// Augment the palette to include custom props
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
