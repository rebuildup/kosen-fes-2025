/// <reference types='node' />

export const APP_CONFIG = {
  analytics: {
    enabled: false,
    enableErrors: true,
    enableEvents: true,
    enablePageViews: true,
    trackingId: "",
  },

  api: {
    baseUrl: "",
    retryAttempts: 3,
    retryDelay: 1000,
    timeout: 10_000,
  },

  contact: {
    address: "宇部市常盤台2-14-1",
    addressEn: "2-14-1 Tokiwadai, Ube, Yamaguchi 755-8555, Japan",
    email: "festival@ube-k.ac.jp",
    phone: "+81-836-35-4951",
  },

  development: {
    enableDebugMode: process.env.NODE_ENV === "development",
    enableErrorReporting: false,
    enablePerformanceMonitoring: false,
    logLevel: "info" as const,
  },

  errors: {
    generic: "エラーが発生しました",
    genericEn: "An error occurred",
    network: "ネットワークエラーが発生しました",
    networkEn: "A network error occurred",
    notFound: "ページが見つかりません",
    notFoundEn: "Page not found",
  },

  features: {
    analytics: false,
    animations: true,
    bookmarks: true,
    darkMode: true,
    map: true,
    notifications: false,
    pwa: false,
    search: true,
  },

  festival: {
    dates: {
      end: "2025-11-08",
      start: "2025-06-14",
    },
    hours: {
      end: "18:00",
      start: "09:00",
    },
    location: "宇部高等専門学校",
    locationEn: "Ube National College of Technology",
    name: "宇部高専祭 2025",
    nameEn: "Ube Kosen Festival 2025",
    year: 2025,
  },

  limits: {
    cardDescriptionMaxLength: 150,
    cardTitleMaxLength: 50,
    maxBookmarks: 100,
    maxSearchHistory: 10,
    maxTagsPerItem: 5,
    searchQueryMaxLength: 100,
  },

  performance: {
    cacheTimeout: 300_000, // 5 minutes
    enableCodeSplitting: true,
    enableImageOptimization: true,
    enableLazyLoading: true,
    imageQuality: 85,
    maxBundleSize: 500, // KB
  },

  site: {
    author: "Ube Kosen",
    description: "宇部高専祭 2025 の公式ウェブサイト",
    descriptionEn: "Official website for Ube Kosen Festival 2025",
    keywords: ["宇部高専", "文化祭", "イベント", "展示", "屋台"],
    title: "宇部高専祭 2025",
    titleEn: "Ube Kosen Festival 2025",
    url: "https://festival.ube-k.ac.jp/2025/",
  },

  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  },

  ui: {
    cardAnimationDuration: 0.3,
    defaultLanguage: "ja" as const,
    defaultTheme: "light" as const,
    enableTransitions: true,
    maxCardGridColumns: 4,
    mobileBreakpoint: 768,
    pageTransitionDuration: 0.2,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;

export const isFeatureEnabled = (
  feature: keyof typeof APP_CONFIG.features,
): boolean => {
  return APP_CONFIG.features[feature];
};

export const getConfig = () => APP_CONFIG;

export default APP_CONFIG;
