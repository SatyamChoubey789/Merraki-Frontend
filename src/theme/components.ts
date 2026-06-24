import type { Components, Theme } from "@mui/material/styles";
import {
  colorTokens,
  shadowTokens,
  borderRadiusTokens,
  transitionTokens,
} from "./tokens";

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      "*": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      },
      html: {
        scrollBehavior: "smooth",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      body: {
        backgroundColor: colorTokens.white,
        color: colorTokens.slate[900],
      },
      "::selection": {
        backgroundColor: colorTokens.financeBlue[100],
        color: colorTokens.financeBlue[900],
      },
      "::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
      },
      "::-webkit-scrollbar-track": {
        background: colorTokens.slate[100],
      },
      "::-webkit-scrollbar-thumb": {
        background: colorTokens.slate[300],
        borderRadius: "3px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: colorTokens.slate[400],
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: borderRadiusTokens.md,
        padding: "12px 28px",
        fontSize: "0.9375rem",
        fontWeight: 600,
        transition: `all ${transitionTokens.base}`,
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0,
          transition: `opacity ${transitionTokens.fast}`,
          background: "rgba(255,255,255,0.1)",
        },
        "&:hover::after": {
          opacity: 1,
        },
      },
      containedPrimary: {
        background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
        boxShadow: shadowTokens.blue,
        color: colorTokens.white,
        "&:hover": {
          boxShadow: shadowTokens.blueHover,
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "translateY(0)",
          boxShadow: shadowTokens.blue,
        },
      },
      outlinedPrimary: {
        borderColor: colorTokens.financeBlue[500],
        color: colorTokens.financeBlue[500],
        borderWidth: "1.5px",
        "&:hover": {
          borderWidth: "1.5px",
          backgroundColor: colorTokens.financeBlue[50],
          borderColor: colorTokens.financeBlue[600],
        },
      },
      sizeLarge: {
        padding: "14px 36px",
        fontSize: "1.0625rem",
      },
      sizeSmall: {
        padding: "8px 20px",
        fontSize: "0.875rem",
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: borderRadiusTokens.lg,
        boxShadow: shadowTokens.md,
        border: `1px solid ${colorTokens.slate[100]}`,
        transition: `all ${transitionTokens.base}`,
        "&:hover": {
          boxShadow: shadowTokens.xl,
          transform: "translateY(-4px)",
        },
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "24px",
        "&:last-child": {
          paddingBottom: "24px",
        },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: borderRadiusTokens.sm,
        fontWeight: 500,
        fontSize: "0.8125rem",
      },
      colorPrimary: {
        backgroundColor: colorTokens.financeBlue[50],
        color: colorTokens.financeBlue[700],
        "&:hover": {
          backgroundColor: colorTokens.financeBlue[100],
        },
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: borderRadiusTokens.md,
          backgroundColor: colorTokens.white,
          transition: `all ${transitionTokens.base}`,
          "& fieldset": {
            borderColor: colorTokens.slate[200],
            borderWidth: "1.5px",
            transition: `border-color ${transitionTokens.base}`,
          },
          "&:hover fieldset": {
            borderColor: colorTokens.financeBlue[300],
          },
          "&.Mui-focused fieldset": {
            borderColor: colorTokens.financeBlue[500],
            borderWidth: "1.5px",
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 3px rgba(26, 86, 219, 0.1)`,
          },
        },
        "& .MuiInputLabel-root": {
          color: colorTokens.slate[500],
          "&.Mui-focused": {
            color: colorTokens.financeBlue[600],
          },
        },
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: `${borderRadiusTokens.xl} 0 0 ${borderRadiusTokens.xl}`,
        boxShadow: shadowTokens["2xl"],
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: borderRadiusTokens.xl,
        boxShadow: shadowTokens["2xl"],
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: colorTokens.darkNavy[800],
        borderRadius: borderRadiusTokens.sm,
        fontSize: "0.8125rem",
        fontWeight: 500,
        padding: "8px 12px",
      },
      arrow: {
        color: colorTokens.darkNavy[800],
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: colorTokens.slate[100],
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: borderRadiusTokens.full,
        height: 6,
        backgroundColor: colorTokens.slate[100],
      },
      bar: {
        borderRadius: borderRadiusTokens.full,
        background: `linear-gradient(90deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
      },
    },
  },

  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: borderRadiusTokens.sm,
        backgroundColor: colorTokens.slate[100],
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: borderRadiusTokens.md,
        border: "1px solid",
      },
      standardSuccess: {
        backgroundColor: colorTokens.success.light,
        borderColor: colorTokens.success.main,
        color: colorTokens.success.dark,
      },
      standardError: {
        backgroundColor: colorTokens.error.light,
        borderColor: colorTokens.error.main,
        color: colorTokens.error.dark,
      },
      standardWarning: {
        backgroundColor: colorTokens.warning.light,
        borderColor: colorTokens.warning.main,
        color: colorTokens.warning.dark,
      },
      standardInfo: {
        backgroundColor: colorTokens.info.light,
        borderColor: colorTokens.info.main,
        color: colorTokens.info.dark,
      },
    },
  },

  MuiTableHead: {
    styleOverrides: {
      root: {
        "& .MuiTableCell-head": {
          backgroundColor: colorTokens.slate[50],
          fontWeight: 600,
          fontSize: "0.8125rem",
          color: colorTokens.slate[600],
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          borderBottom: `2px solid ${colorTokens.slate[200]}`,
        },
      },
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: colorTokens.slate[50],
        },
        "& .MuiTableCell-root": {
          borderBottom: `1px solid ${colorTokens.slate[100]}`,
        },
      },
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 700,
        fontSize: "0.6875rem",
        minWidth: "18px",
        height: "18px",
        padding: "0 4px",
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 500,
        fontSize: "0.9375rem",
        minHeight: 48,
        transition: `all ${transitionTokens.base}`,
        "&.Mui-selected": {
          fontWeight: 600,
        },
      },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: `${borderRadiusTokens.full} ${borderRadiusTokens.full} 0 0`,
        background: `linear-gradient(90deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
      },
    },
  },

  MuiStepLabel: {
    styleOverrides: {
      label: {
        fontWeight: 500,
        "&.Mui-active": {
          fontWeight: 700,
          color: colorTokens.financeBlue[600],
        },
        "&.Mui-completed": {
          color: colorTokens.success.main,
        },
      },
    },
  },

  MuiStepIcon: {
    styleOverrides: {
      root: {
        color: colorTokens.slate[200],
        "&.Mui-active": {
          color: colorTokens.financeBlue[500],
        },
        "&.Mui-completed": {
          color: colorTokens.success.main,
        },
      },
    },
  },
};
