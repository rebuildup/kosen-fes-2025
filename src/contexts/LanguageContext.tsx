// src/contexts/LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define language type
export type Language = "en" | "ja";

// Define translations type
export type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Translation data
const translations: Translations = {
  // Common
  "common.home": {
    en: "Home",
    ja: "ホーム",
  },
  "common.events": {
    en: "Events",
    ja: "イベント",
  },
  "common.exhibits": {
    en: "Exhibits",
    ja: "展示",
  },
  "common.timetable": {
    en: "Timetable",
    ja: "スケジュール",
  },
  "common.map": {
    en: "Map",
    ja: "マップ",
  },
  "common.search": {
    en: "Search",
    ja: "検索",
  },
  "common.bookmarks": {
    en: "Bookmarks",
    ja: "ブックマーク",
  },

  // Home
  "home.festivalTitle": {
    en: "Cultural Festival 2025",
    ja: "文化祭 2025",
  },
  "home.festivalDates": {
    en: "May 15-16, 2025",
    ja: "2025年5月15日・16日",
  },
  "home.subtitle": {
    en: "Experience art, music, and culture",
    ja: "芸術、音楽、文化を体験しよう",
  },
  "home.exploreEvents": {
    en: "Explore Events",
    ja: "イベントを見る",
  },
  "home.latestNews": {
    en: "Latest News",
    ja: "最新情報",
  },
  "home.featuredEvents": {
    en: "Featured Events",
    ja: "注目イベント",
  },
  "home.viewAll": {
    en: "View All",
    ja: "すべて見る",
  },

  // Events & Exhibits
  "events.title": {
    en: "Events",
    ja: "イベント一覧",
  },
  "events.searchPlaceholder": {
    en: "Search events...",
    ja: "イベントを検索...",
  },
  "exhibits.title": {
    en: "Exhibits",
    ja: "展示一覧",
  },
  "exhibits.searchPlaceholder": {
    en: "Search exhibits...",
    ja: "展示を検索...",
  },

  // Map
  "map.title": {
    en: "Campus Map",
    ja: "キャンパスマップ",
  },
  "map.locations": {
    en: "Venues",
    ja: "会場一覧",
  },

  // Timetable
  "timetable.title": {
    en: "Timetable",
    ja: "タイムスケジュール",
  },

  // Categories
  "category.all": {
    en: "All",
    ja: "すべて",
  },
  "category.ceremony": {
    en: "Ceremony",
    ja: "セレモニー",
  },
  "category.performance": {
    en: "Performance",
    ja: "パフォーマンス",
  },
  "category.workshop": {
    en: "Workshop",
    ja: "ワークショップ",
  },
  "category.food": {
    en: "Food",
    ja: "飲食",
  },
  "category.exhibition": {
    en: "Exhibition",
    ja: "展示",
  },
  "category.competition": {
    en: "Competition",
    ja: "コンペティション",
  },
  "category.film": {
    en: "Film",
    ja: "映画",
  },

  // UI
  "ui.loading": {
    en: "Loading...",
    ja: "読み込み中...",
  },
  "ui.noResults": {
    en: "No results found",
    ja: "検索結果がありません",
  },
  "ui.search": {
    en: "Search",
    ja: "検索",
  },
  "ui.theme": {
    en: "Theme",
    ja: "テーマ",
  },
  "ui.language": {
    en: "Language",
    ja: "言語",
  },
  "ui.dark": {
    en: "Dark",
    ja: "ダーク",
  },
  "ui.light": {
    en: "Light",
    ja: "ライト",
  },
};

// Define context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize language from localStorage or browser
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      return savedLanguage;
    }

    // Check browser language
    const browserLang = navigator.language.split("-")[0];
    return browserLang === "ja" ? "ja" : "en";
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
