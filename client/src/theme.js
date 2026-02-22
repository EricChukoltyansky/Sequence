// src/theme.js - Professional Theme System for Music Sequencer

export const theme = {
  // Color Palette - Modern Dark Theme inspired by professional DAWs
  colors: {
    // Background colors
    primary: "#0f0f0f", // Main background - deep black
    secondary: "#1a1a1a", // Secondary surfaces
    tertiary: "#252525", // Elevated surfaces
    quaternary: "#303030", // Highest elevation

    // UI Colors
    border: "#404040", // Border color
    borderLight: "#555555", // Light borders
    hover: "#3a3a3a", // Hover states
    active: "#505050", // Active states

    // Text colors
    text: {
      primary: "#ffffff", // Primary text
      secondary: "#b3b3b3", // Secondary text
      muted: "#808080", // Muted text
      disabled: "#4a4a4a", // Disabled text
    },

    // Track colors - Color-coded for different instrument groups
    tracks: {
      piano: {
        primary: "#ffd700", // Gold
        secondary: "#ffed4e", // Light gold
        background: "#2a2416", // Dark gold background
        glow: "#ffd700",
      },
      bass: {
        primary: "#00bfff", // Deep sky blue
        secondary: "#4dd0ff", // Light blue
        background: "#162329", // Dark blue background
        glow: "#00bfff",
      },
      drums: {
        primary: "#ff1493", // Deep pink
        secondary: "#ff69b4", // Hot pink
        background: "#2a1621", // Dark pink background
        glow: "#ff1493",
      },
    },

    // Transport controls
    transport: {
      play: "#00e676", // Bright green
      pause: "#ff6b35", // Orange
      stop: "#e53e3e", // Red
      record: "#ff1744", // Bright red
    },

    // Status colors
    status: {
      success: "#00e676",
      warning: "#ffb300",
      error: "#f44336",
      info: "#2196f3",
    },

    // Glassmorphism effects
    glass: {
      background: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.1)",
      backdrop: "blur(10px)",
    },
  },

  // Typography - Inter font for modern look
  typography: {
    fontFamily: {
      primary:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Monaco, Consolas, monospace',
      display: '"Poppins", "Inter", sans-serif',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing system
  spacing: {
    xs: "0.20rem", // 3.2px
    sm: "0.4rem", // 6.4px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    "3xl": "3rem", // 48px
    "4xl": "4rem", // 64px
    "5xl": "6rem", // 96px
  },

  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },

  // Shadows for depth
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    glow: "0 0 20px rgba(255, 255, 255, 0.1)",
    glowColor: (color) => `0 0 20px ${color}`,
  },

  // Transitions for smooth animations
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "350ms cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "350ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    modal: 1050,
    popover: 1060,
    tooltip: 1080,
  },

  // Component-specific styles
  components: {
    // Sequencer cell styles
    cell: {
      size: "5rem", // 80px for desktop
      sizeSmall: "2rem", // 32px for mobile
      borderWidth: "2px",
      activeBorderWidth: "3px",
    },

    // Button styles
    button: {
      height: {
        sm: "2rem",
        md: "2.5rem",
        lg: "3rem",
      },
      borderRadius: "0.5rem",
    },

    // Transport control specific
    transport: {
      size: "3.5rem", // Larger for transport controls
      iconSize: "1.5rem",
    },

    // Slider styles
    slider: {
      height: "0.375rem", // 6px track height
      thumbSize: "1.25rem", // 20px thumb
      borderRadius: "0.5rem",
    },
  },

  // Animation keyframes
  animations: {
    pulse: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `,
    fadeIn: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
    slideIn: `
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `,
    glow: `
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.2); }
        }
      `,
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Media queries
  media: {
    sm: `@media (min-width: 640px)`,
    md: `@media (min-width: 768px)`,
    lg: `@media (min-width: 1024px)`,
    xl: `@media (min-width: 1280px)`,
    mobile: `@media (max-width: 767px)`,
    tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
    desktop: `@media (min-width: 1024px)`,
  },
};

// Helper functions for common styling patterns
export const helpers = {
  // Get track color based on row index
  getTrackColor: (row) => {
    if (row <= 5) return theme.colors.tracks.piano;
    if (row <= 9) return theme.colors.tracks.bass;
    return theme.colors.tracks.drums;
  },

  // Create glassmorphism effect
  glassmorphism: (background = theme.colors.glass.background) => `
      background: ${background};
      backdrop-filter: ${theme.colors.glass.backdrop};
      border: 1px solid ${theme.colors.glass.border};
    `,

  // Create glow effect
  glow: (color, intensity = 20) => `
      box-shadow: 0 0 ${intensity}px ${color};
    `,

  // Create smooth transitions
  transition: (properties = "all", duration = theme.transitions.normal) => `
      transition: ${properties} ${duration};
    `,

  // Create hover effects
  hover: (styles) => `
      transition: ${theme.transitions.fast};
      &:hover {
        ${styles}
      }
    `,

  // Create focus effects for accessibility
  focus: (color = theme.colors.status.info) => `
      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${color};
      }
    `,

  // Responsive helper
  responsive: (mobile, tablet = mobile, desktop = tablet) => `
      ${mobile}
      ${theme.media.tablet} {
        ${tablet}
      }
      ${theme.media.desktop} {
        ${desktop}
      }
    `,
};

export default theme;
