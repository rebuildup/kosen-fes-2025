/**
 * Application Configuration
 * Central configuration for the Kosen Festival 2025 website
 */

export const APP_CONFIG = {
  // Site metadata
  site: {
    title: "宇部高専文化祭 2025",
    titleEn: "Ube Kosen Festival 2025",
    description: "宇部高専文化祭 2025 の公式ウェブサイト",
    descriptionEn: "Official website for Ube Kosen Festival 2025",
    url: "https://festival.ube-k.ac.jp/2025/",
    author: "Ube Kosen",
    keywords: ["宇部高専", "文化祭", "イベント", "展示", "屋台"],
  },

  // Festival dates and times
  festival: {
    name: "宇部高専文化祭 2025",
    nameEn: "Ube Kosen Festival 2025",
    year: 2025,
    dates: {
      start: "2025-06-14",
      end: "2025-06-15",
    },
    hours: {
      start: "09:00",
      end: "18:00",
    },
    location: "宇部高等専門学校",
    locationEn: "Ube National College of Technology",
  },

  // Feature flags
  features: {
    darkMode: true,
    bookmarks: true,
    search: true,
    map: true,
    animations: true,
    analytics: false,
    pwa: false,
    notifications: false,
  },

  // Performance settings
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    maxBundleSize: 500, // KB
    imageQuality: 85,
    cacheTimeout: 300000, // 5 minutes
  },

  // UI configuration
  ui: {
    defaultTheme: "light" as const,
    defaultLanguage: "ja" as const,
    enableTransitions: true,
    cardAnimationDuration: 0.3,
    pageTransitionDuration: 0.2,
    maxCardGridColumns: 4,
    mobileBreakpoint: 768,
  },

  // Content limits
  limits: {
    maxBookmarks: 100,
    maxSearchHistory: 10,
    maxTagsPerItem: 5,
    cardTitleMaxLength: 50,
    cardDescriptionMaxLength: 150,
    searchQueryMaxLength: 100,
  },

  // API configuration (for future use)
  api: {
    baseUrl: "",
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Analytics configuration (if enabled)
  analytics: {
    enabled: false,
    trackingId: "",
    enablePageViews: true,
    enableEvents: true,
    enableErrors: true,
  },

  // Contact information
  contact: {
    email: "festival@ube-k.ac.jp",
    phone: "+81-836-35-4951",
    address: "宇部市常盤台2-14-1",
    addressEn: "2-14-1 Tokiwadai, Ube, Yamaguchi 755-8555, Japan",
  },

  // Social media links
  social: {
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },

  // Error messages
  errors: {
    generic: "エラーが発生しました",
    genericEn: "An error occurred",
    network: "ネットワークエラーが発生しました",
    networkEn: "A network error occurred",
    notFound: "ページが見つかりません",
    notFoundEn: "Page not found",
  },

  // Development settings
  development: {
    enableDebugMode: process.env.NODE_ENV === "development",
    enablePerformanceMonitoring: false,
    enableErrorReporting: false,
    logLevel: "info" as const,
  },
} as const;

// Type for configuration
export type AppConfig = typeof APP_CONFIG;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof APP_CONFIG.features): boolean => {
  return APP_CONFIG.features[feature];
};

export const getConfig = () => APP_CONFIG;

export default APP_CONFIG;