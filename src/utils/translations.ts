export type Language = "en" | "ja";

export interface Translations {
  [key: string]: string | Translations;
}

// English translations
export const enTranslations: Translations = {
  siteName: "Ube Kosen Festival 2025",
  navigation: {
    home: "Home",
    events: "Events",
    exhibits: "Exhibits & Stalls",
    schedule: "Schedule",
    map: "Map",
    search: "Search",
    bookmarks: "Bookmarks",
  },
  settings: {
    theme: {
      light: "Light Mode",
      dark: "Dark Mode",
      switchToLight: "Switch to Light Theme",
      switchToDark: "Switch to Dark Theme",
    },
    language: {
      en: "English",
      ja: "Japanese",
      switchToEn: "Switch to English",
      switchToJa: "Switch to Japanese",
    },
  },
  actions: {
    close: "Close",
    open: "Open Menu",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    bookmark: "Bookmark",
    removeBookmark: "Remove Bookmark",
    search: "Search",
    viewDetails: "View Details",
  },
  home: {
    title: "Welcome to Ube Kosen Festival 2025",
    subtitle: "Check out our featured events and exhibits!",
    featuredEvents: "Featured Events",
    featuredExhibits: "Featured Exhibits",
  },
  events: {
    title: "Events",
    noEvents: "No events found",
    filters: {
      all: "All Events",
      day1: "Day 1",
      day2: "Day 2",
    },
  },
  exhibits: {
    title: "Exhibits & Stalls",
    noExhibits: "No exhibits found",
    noStalls: "No stalls found",
    filters: {
      all: "All",
      exhibits: "Exhibits",
      stalls: "Stalls",
    },
  },
  schedule: {
    title: "Schedule",
    day1: "Day 1",
    day2: "Day 2",
  },
  map: {
    title: "Festival Map",
    viewLocations: "View Locations",
  },
  detail: {
    back: "Back to List",
    event: "Event",
    exhibit: "Exhibit",
    stall: "Stall",
    date: "Date",
    time: "Time",
    location: "Location",
    organizer: "Organizer",
    creator: "Creator",
    products: "Products",
    tags: "Tags",
  },
  search: {
    placeholder: "Search for events, exhibits, etc.",
    noResults: "No results found",
    results: "Search Results",
  },
  bookmarks: {
    title: "Bookmarks",
    noBookmarks:
      "No bookmarks yet. Explore events and exhibits and bookmark your favorites!",
    bookmarkedItems: "Bookmarked Items",
    clearAll: "Clear All",
    all: "All",
    noItemsOfType: "No bookmarked items of this type",
    description: "Your saved events, exhibits, and stalls will appear here.",
  },
  errors: {
    pageNotFound: "Page Not Found",
    pageNotFoundMessage: "The page you're looking for doesn't exist.",
    backToHome: "Go back to home",
    genericError: "Something went wrong",
    tryAgain: "Try Again",
  },
  tags: {
    popularTags: "Popular Tags",
    filterByTag: "Filter by Tag",
    clearFilters: "Clear Filters",
    searchTags: "Search tags...",
    noTagsFound: "No tags found",
    activeFilters: "Active Filters",
    clearAll: "Clear All",
    showMore: "Show more",
    relatedTags: "Related Tags",
  },
};

// Japanese translations
export const jaTranslations: Translations = {
  siteName: "宇部高専祭 2025",
  navigation: {
    home: "ホーム",
    events: "イベント",
    exhibits: "展示・露店",
    schedule: "タイムスケジュール",
    map: "マップ",
    search: "検索",
    bookmarks: "ブックマーク",
  },
  settings: {
    theme: {
      light: "ライトモード",
      dark: "ダークモード",
      switchToLight: "ライトテーマに切り替え",
      switchToDark: "ダークテーマに切り替え",
    },
    language: {
      en: "英語",
      ja: "日本語",
      switchToEn: "英語に切り替え",
      switchToJa: "日本語に切り替え",
    },
  },
  actions: {
    close: "閉じる",
    open: "メニューを開く",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    bookmark: "ブックマーク",
    removeBookmark: "ブックマークを解除",
    search: "検索",
    viewDetails: "詳細を見る",
  },
  home: {
    title: "宇部高専祭 2025へようこそ",
    subtitle: "注目のイベントや展示をチェック！",
    featuredEvents: "注目イベント",
    featuredExhibits: "注目展示",
  },
  events: {
    title: "イベント",
    noEvents: "イベントが見つかりません",
    filters: {
      all: "すべてのイベント",
      day1: "1日目",
      day2: "2日目",
    },
  },
  exhibits: {
    title: "展示・露店",
    noExhibits: "展示が見つかりません",
    noStalls: "露店が見つかりません",
    filters: {
      all: "すべて",
      exhibits: "展示",
      stalls: "露店",
    },
  },
  schedule: {
    title: "タイムスケジュール",
    day1: "1日目",
    day2: "2日目",
  },
  map: {
    title: "会場マップ",
    viewLocations: "場所を表示",
  },
  detail: {
    back: "一覧に戻る",
    event: "イベント",
    exhibit: "展示",
    stall: "露店",
    date: "日付",
    time: "時間",
    location: "場所",
    organizer: "主催者",
    creator: "制作者",
    products: "商品",
    tags: "タグ",
  },
  search: {
    placeholder: "イベント、展示などを検索",
    noResults: "検索結果が見つかりません",
    results: "検索結果",
  },
  bookmarks: {
    title: "ブックマーク",
    noBookmarks:
      "まだブックマークがありません。イベントや展示を探索して、お気に入りをブックマークしましょう！",
    bookmarkedItems: "ブックマークしたアイテム",
    clearAll: "すべて削除",
    all: "すべて",
    noItemsOfType: "このタイプのブックマークはありません",
    description: "保存したイベント、展示、露店がここに表示されます。",
  },
  errors: {
    pageNotFound: "ページが見つかりません",
    pageNotFoundMessage: "お探しのページは存在しません。",
    backToHome: "ホームに戻る",
    genericError: "エラーが発生しました",
    tryAgain: "再試行",
  },
  tags: {
    popularTags: "人気のタグ",
    filterByTag: "タグでフィルター",
    clearFilters: "フィルターをクリア",
    searchTags: "タグを検索...",
    noTagsFound: "タグが見つかりません",
    activeFilters: "有効なフィルター",
    clearAll: "すべてクリア",
    showMore: "もっと見る",
    relatedTags: "関連タグ",
  },
};

// Function to get translations for a language
export const getTranslationsForLanguage = (
  language: Language
): Translations => {
  return language === "en" ? enTranslations : jaTranslations;
};

// Function to get a nested value from translations using dot notation
export const getTranslationValue = (
  translations: Translations,
  key: string
): string => {
  const keys = key.split(".");
  let result: any = translations;

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      return key; // Return the key if the translation is not found
    }
  }

  return typeof result === "string" ? result : key;
};
