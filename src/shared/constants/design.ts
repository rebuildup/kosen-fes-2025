/**
 * Design System Constants
 * Centralized design tokens and configuration values
 */

// Breakpoints
export const BREAKPOINTS = {
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280,
  MOBILE: 480,
  TABLET: 768,
} as const;

// Layout dimensions
export const LAYOUT = {
  CARD_GRID_GAP: 16,
  CARD_GRID_MIN_WIDTH: 280,
  CONTAINER_MAX_WIDTH: 1200,
  HEADER_HEIGHT: 60,
  SIDEBAR_WIDTH_DESKTOP: 250,
  SIDEBAR_WIDTH_MOBILE: 220,
} as const;

// Animation durations (in seconds)
export const ANIMATION_DURATION = {
  FAST: 0.2,
  INSTANT: 0.1,
  NORMAL: 0.3,
  SLOW: 0.5,
  VERY_SLOW: 0.8,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  FIXED: 1030,
  MODAL: 1050,
  MODAL_BACKDROP: 1040,
  NOTIFICATION: 1080,
  POPOVER: 1060,
  STICKY: 1020,
  TOOLTIP: 1070,
} as const;

// Card variants configuration
export const CARD_CONFIG = {
  ANIMATION_OFFSETS: {
    COMPACT: -2,
    DEFAULT: -6,
    FEATURED: -8,
    LIST: -2,
  },
  ASPECT_RATIOS: {
    COMPACT: 0, // No fixed ratio
    DEFAULT: 56.25, // 16:9
    FEATURED: 50, // 2:1
    SQUARE: 100, // 1:1
  },
  GRID_COLUMNS: {
    DESKTOP: 3,
    LARGE: 4,
    MOBILE: 1,
    TABLET: 2,
  },
  IMAGE_SCALES: {
    COMPACT: 1.02,
    DEFAULT: 1.05,
    FEATURED: 1.08,
    LIST: 1.02,
  },
} as const;

// Image configuration
export const IMAGE_CONFIG = {
  PLACEHOLDER_PATHS: {
    DEFAULT: "./images/placeholder.jpg",
    EVENT: "./images/placeholder-event.jpg",
    EXHIBIT: "./images/placeholder-exhibit.jpg",
    SPONSOR: "./images/placeholder-sponsor.jpg",
    STALL: "./images/placeholder-stall.jpg",
  },
  QUALITY: {
    FULL: 90,
    PREVIEW: 80,
    THUMBNAIL: 60,
  },
  SIZES: {
    LARGE: { height: 675, width: 1200 },
    MEDIUM: { height: 450, width: 800 },
    SMALL: { height: 225, width: 400 },
  },
} as const;

// Typography scales
export const TYPOGRAPHY = {
  FONT_SIZES: {
    "2XL": "1.5rem", // 24px
    "3XL": "1.875rem", // 30px
    "4XL": "2.25rem", // 36px
    BASE: "1rem", // 16px
    LG: "1.125rem", // 18px
    SM: "0.875rem", // 14px
    XL: "1.25rem", // 20px
    XS: "0.75rem", // 12px
  },
  FONT_WEIGHTS: {
    BOLD: 700,
    MEDIUM: 500,
    NORMAL: 400,
    SEMIBOLD: 600,
  },
  LINE_HEIGHTS: {
    NORMAL: 1.5,
    RELAXED: 1.75,
    TIGHT: 1.25,
  },
} as const;

// Spacing scale (in rem)
export const SPACING = {
  "0": "0",
  "1": "0.25rem", // 4px
  "2": "0.5rem", // 8px
  "3": "0.75rem", // 12px
  "4": "1rem", // 16px
  "5": "1.25rem", // 20px
  "6": "1.5rem", // 24px
  "8": "2rem", // 32px
  "10": "2.5rem", // 40px
  "12": "3rem", // 48px
  "16": "4rem", // 64px
  "20": "5rem", // 80px
  "24": "6rem", // 96px
} as const;

// Border radius values
export const BORDER_RADIUS = {
  DEFAULT: "0.375rem", // 6px
  FULL: "9999px",
  LG: "0.75rem", // 12px
  MD: "0.5rem", // 8px
  NONE: "0",
  SM: "0.25rem", // 4px
  XL: "1rem", // 16px
} as const;

// Shadow configurations
export const SHADOWS = {
  DEFAULT: "0 2px 8px rgba(0, 0, 0, 0.08)",
  INNER: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
  LG: "0 8px 20px rgba(0, 0, 0, 0.15)",
  MD: "0 4px 12px rgba(0, 0, 0, 0.1)",
  SM: "0 1px 2px rgba(0, 0, 0, 0.05)",
  XL: "0 12px 24px rgba(0, 0, 0, 0.2)",
} as const;

// Accessibility
export const A11Y = {
  COLOR_CONTRAST_AA: 4.5,
  COLOR_CONTRAST_AAA: 7,
  FOCUS_RING: "0 0 0 2px var(--primary-alpha-50)",
  MIN_TOUCH_TARGET: 44, // pixels
} as const;

// Content limits
export const CONTENT_LIMITS = {
  CARD_DESCRIPTION_LINES: 3,
  CARD_TAGS_VISIBLE: 3,
  CARD_TITLE_LINES: 2,
  MAX_BOOKMARKS: 100,
  MAX_SEARCH_HISTORY: 10,
  SEARCH_RESULTS_PER_PAGE: 20,
} as const;

// Performance thresholds
export const PERFORMANCE = {
  DEBOUNCE_SEARCH_MS: 300,
  LAZY_LOAD_THRESHOLD: "10px",
  MAX_BUNDLE_SIZE_KB: 500,
  TARGET_FCP_MS: 1500,
  TARGET_LCP_MS: 2500,
  THROTTLE_SCROLL_MS: 16,
} as const;
