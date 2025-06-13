/**
 * Design System Constants
 * Centralized design tokens and configuration values
 */

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280,
} as const;

// Layout dimensions
export const LAYOUT = {
  HEADER_HEIGHT: 60,
  SIDEBAR_WIDTH_MOBILE: 220,
  SIDEBAR_WIDTH_DESKTOP: 250,
  CONTAINER_MAX_WIDTH: 1200,
  CARD_GRID_MIN_WIDTH: 280,
  CARD_GRID_GAP: 16,
} as const;

// Animation durations (in seconds)
export const ANIMATION_DURATION = {
  INSTANT: 0.1,
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  VERY_SLOW: 0.8,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const;

// Card variants configuration
export const CARD_CONFIG = {
  ASPECT_RATIOS: {
    DEFAULT: 56.25, // 16:9
    FEATURED: 50,   // 2:1
    COMPACT: 0,     // No fixed ratio
    SQUARE: 100,    // 1:1
  },
  GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE: 4,
  },
  ANIMATION_OFFSETS: {
    DEFAULT: -6,
    FEATURED: -8,
    COMPACT: -2,
    LIST: -2,
  },
  IMAGE_SCALES: {
    DEFAULT: 1.05,
    FEATURED: 1.08,
    COMPACT: 1.02,
    LIST: 1.02,
  },
} as const;

// Image configuration
export const IMAGE_CONFIG = {
  PLACEHOLDER_PATHS: {
    DEFAULT: "/images/placeholder.jpg",
    EVENT: "/images/placeholder-event.jpg",
    EXHIBIT: "/images/placeholder-exhibit.jpg",
    STALL: "/images/placeholder-stall.jpg",
    SPONSOR: "/images/placeholder-sponsor.jpg",
  },
  SIZES: {
    SMALL: { width: 400, height: 225 },
    MEDIUM: { width: 800, height: 450 },
    LARGE: { width: 1200, height: 675 },
  },
  QUALITY: {
    THUMBNAIL: 60,
    PREVIEW: 80,
    FULL: 90,
  },
} as const;

// Typography scales
export const TYPOGRAPHY = {
  FONT_SIZES: {
    XS: "0.75rem",   // 12px
    SM: "0.875rem",  // 14px
    BASE: "1rem",    // 16px
    LG: "1.125rem",  // 18px
    XL: "1.25rem",   // 20px
    "2XL": "1.5rem", // 24px
    "3XL": "1.875rem", // 30px
    "4XL": "2.25rem",  // 36px
  },
  LINE_HEIGHTS: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
  },
  FONT_WEIGHTS: {
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
  },
} as const;

// Spacing scale (in rem)
export const SPACING = {
  "0": "0",
  "1": "0.25rem",   // 4px
  "2": "0.5rem",    // 8px
  "3": "0.75rem",   // 12px
  "4": "1rem",      // 16px
  "5": "1.25rem",   // 20px
  "6": "1.5rem",    // 24px
  "8": "2rem",      // 32px
  "10": "2.5rem",   // 40px
  "12": "3rem",     // 48px
  "16": "4rem",     // 64px
  "20": "5rem",     // 80px
  "24": "6rem",     // 96px
} as const;

// Border radius values
export const BORDER_RADIUS = {
  NONE: "0",
  SM: "0.25rem",    // 4px
  DEFAULT: "0.375rem", // 6px
  MD: "0.5rem",     // 8px
  LG: "0.75rem",    // 12px
  XL: "1rem",       // 16px
  FULL: "9999px",
} as const;

// Shadow configurations
export const SHADOWS = {
  SM: "0 1px 2px rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 2px 8px rgba(0, 0, 0, 0.08)",
  MD: "0 4px 12px rgba(0, 0, 0, 0.1)",
  LG: "0 8px 20px rgba(0, 0, 0, 0.15)",
  XL: "0 12px 24px rgba(0, 0, 0, 0.2)",
  INNER: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
} as const;

// Accessibility
export const A11Y = {
  FOCUS_RING: "0 0 0 2px var(--primary-alpha-50)",
  MIN_TOUCH_TARGET: 44, // pixels
  COLOR_CONTRAST_AA: 4.5,
  COLOR_CONTRAST_AAA: 7,
} as const;

// Content limits
export const CONTENT_LIMITS = {
  CARD_TITLE_LINES: 2,
  CARD_DESCRIPTION_LINES: 3,
  CARD_TAGS_VISIBLE: 3,
  SEARCH_RESULTS_PER_PAGE: 20,
  MAX_BOOKMARKS: 100,
  MAX_SEARCH_HISTORY: 10,
} as const;

// Performance thresholds
export const PERFORMANCE = {
  DEBOUNCE_SEARCH_MS: 300,
  THROTTLE_SCROLL_MS: 16,
  LAZY_LOAD_THRESHOLD: "10px",
  MAX_BUNDLE_SIZE_KB: 500,
  TARGET_FCP_MS: 1500,
  TARGET_LCP_MS: 2500,
} as const;