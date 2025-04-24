export type Language = "en" | "ja";

export interface Translations {
  [key: string]: string | Translations;
}

// English translations
export const enTranslations: Translations = {
  siteName: "Ube Kosen Festival 2025",
  language: "en",
  navigation: {
    home: "Home",
    events: "Events",
    exhibits: "Exhibits & Stalls",
    schedule: "Schedule",
    map: "Map",
    search: "Search",
    bookmarks: "Bookmarks",
    quickLinks: "Quick Links",
    menu: "Menu",
    main: "Main Navigation",
  },
  settings: {
    title: "Settings",
    theme: {
      title: "Theme",
      light: "Light Mode",
      dark: "Dark Mode",
      switchToLight: "Switch to Light Theme",
      switchToDark: "Switch to Dark Theme",
    },
    language: {
      title: "Language",
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
    clear: "Clear",
  },
  home: {
    title: "Welcome to Ube Kosen Festival 2025",
    subtitle:
      "Explore events, exhibits, and performances at Ube National College of Technology on November 8-9, 2025!",
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
    noEvents: "No events scheduled for this day",
  },
  map: {
    title: "Festival Map",
    viewLocations: "View Locations",
    viewFullMap: "View Full Map",
    item: "Item",
    items: "Items",
    noLocations: "No locations found",
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
    duration: "Duration",
    related: "Related Items",
    noRelatedItems: "No related items found",
  },
  search: {
    title: "Search",
    placeholder: "Search for events, exhibits, etc.",
    noResults: "No results found",
    searching: "Searching",
    recentSearches: "Recent Searches",
    tryDifferentQuery: "Try using different keywords or filters.",
    result: "result",
    results: "results",
    enterQuery: "Enter a search term or select a tag to start searching",
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
    startBookmarking:
      "Explore events, exhibits, and stalls and bookmark your favorites to see them here.",
  },
  errors: {
    pageNotFound: "Page Not Found",
    pageNotFoundMessage:
      "The page you're looking for doesn't exist or has been moved.",
    backToHome: "Go back to home",
    genericError: "Something went wrong",
    genericErrorMessage: "An error occurred while processing your request.",
    serverError: "Server Error",
    serverErrorMessage:
      "We're experiencing issues with our server. Please try again later.",
    applicationError: "Application Error",
    tryAgain: "Try Again",
    itemNotFound: "Item not found",
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
  info: {
    title: "Festival Info",
    festivalDates: "Festival Dates: November 8-9, 2025",
    location: "Location: Ube National College of Technology",
    organizer: "Organizer: Festival Committee",
    contactUs: "Contact Us",
  },
  common: {
    view: "View",
    viewDefault: "Default View",
    viewCompact: "Compact View",
    viewGrid: "Grid View",
    viewList: "List View",
    noItems: "No items found",
    loadMore: "Load More",
    showAll: "Show All",
  },
};

// Japanese translations
export const jaTranslations: Translations = {
  siteName: "宇部高専祭 2025",
  language: "ja",
  navigation: {
    home: "ホーム",
    events: "イベント",
    exhibits: "展示・露店",
    schedule: "タイムスケジュール",
    map: "マップ",
    search: "検索",
    bookmarks: "ブックマーク",
    quickLinks: "クイックリンク",
    menu: "メニュー",
    main: "メインナビゲーション",
  },
  settings: {
    title: "設定",
    theme: {
      title: "テーマ",
      light: "ライトモード",
      dark: "ダークモード",
      switchToLight: "ライトテーマに切り替え",
      switchToDark: "ダークテーマに切り替え",
    },
    language: {
      title: "言語",
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
    clear: "クリア",
  },
  home: {
    title: "宇部高専祭 2025へようこそ",
    subtitle:
      "2025年11月8日～9日に宇部工業高等専門学校で開催される展示やイベントをご覧ください！",
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
    noEvents: "この日のイベントはありません",
  },
  map: {
    title: "会場マップ",
    viewLocations: "場所を表示",
    viewFullMap: "マップ全体を表示",
    item: "アイテム",
    items: "アイテム",
    noLocations: "場所が見つかりません",
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
    duration: "所要時間",
    related: "関連アイテム",
    noRelatedItems: "関連アイテムが見つかりません",
  },
  search: {
    title: "検索",
    placeholder: "イベント、展示などを検索",
    noResults: "検索結果が見つかりません",
    searching: "検索中",
    recentSearches: "最近の検索",
    tryDifferentQuery:
      "別のキーワードやフィルターを使って検索してみてください。",
    result: "件の結果",
    results: "件の結果",
    enterQuery: "検索語を入力するか、タグを選択して検索を開始してください",
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
    startBookmarking:
      "イベント、展示、露店を探索して、お気に入りをブックマークして、ここで表示します。",
  },
  errors: {
    pageNotFound: "ページが見つかりません",
    pageNotFoundMessage: "お探しのページは存在しないか、移動されました。",
    backToHome: "ホームに戻る",
    genericError: "エラーが発生しました",
    genericErrorMessage: "リクエストの処理中にエラーが発生しました。",
    serverError: "サーバーエラー",
    serverErrorMessage:
      "サーバーに問題が発生しています。後でもう一度お試しください。",
    applicationError: "アプリケーションエラー",
    tryAgain: "再試行",
    itemNotFound: "アイテムが見つかりません",
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
  info: {
    title: "祭り情報",
    festivalDates: "開催日: 2025年11月8日～9日",
    location: "場所: 宇部工業高等専門学校",
    organizer: "主催者: 実行委員会",
    contactUs: "お問い合わせ",
  },
  common: {
    view: "表示",
    viewDefault: "デフォルト表示",
    viewCompact: "コンパクト表示",
    viewGrid: "グリッド表示",
    viewList: "リスト表示",
    noItems: "アイテムが見つかりません",
    loadMore: "もっと見る",
    showAll: "すべて表示",
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
