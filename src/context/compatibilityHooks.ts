// Backward compatibility adapters for existing hooks
import { useData } from "./DataContext";

// Adapter for useSearch hook
export const useSearchCompat = () => {
  const { searchItems, addToSearchHistory, searchHistory } = useData();

  type SearchResults = ReturnType<typeof searchItems>;
  const emptyResults: SearchResults = [];

  return {
    searchQuery: "",
    setSearchQuery: () => {},
    searchResults: emptyResults,
    performSearch: (query: string): SearchResults => {
      addToSearchHistory(query);
      return searchItems(query);
    },
    isSearching: false,
    clearSearch: () => {},
    searchHistory,
    recentSearches: searchHistory.slice(0, 5),
  };
};

// Adapter for useBookmark hook
export const useBookmarkCompat = () => {
  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarkedItems,
  } = useData();

  return {
    bookmarks,
    bookmarkedItems: getBookmarkedItems(),
    addBookmark,
    removeBookmark,
    toggleBookmark: (id: string) => {
      if (isBookmarked(id)) {
        removeBookmark(id);
      } else {
        addBookmark(id);
      }
    },
    isBookmarked,
    clearAllBookmarks: () => {
      bookmarks.forEach((id) => removeBookmark(id));
    },
    getBookmarkedItemsByType: (type: string) => {
      return getBookmarkedItems().filter((item) => item.type === type);
    },
    getBookmarkCount: () => bookmarks.length,
  };
};

// Adapter for useTag hook
export const useTagCompat = () => {
  const { getAllTags, getPopularTags, getTagCounts } = useData();

  // Simple state management for selected tags (could be enhanced)
  let selectedTags: string[] = [];

  return {
    tags: getAllTags(),
    popularTags: getPopularTags(),
    selectedTags,
    tagCounts: getTagCounts(),
    toggleTag: (tag: string) => {
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter((t) => t !== tag);
      } else {
        selectedTags = [...selectedTags, tag];
      }
    },
    selectTag: (tag: string) => {
      selectedTags = [tag];
    },
    clearTags: () => {
      selectedTags = [];
    },
    isTagSelected: (tag: string) => selectedTags.includes(tag),
    filterItemsByTags: <T extends { tags: string[] }>(items: T[]): T[] => {
      if (selectedTags.length === 0) return items;
      return items.filter((item) =>
        selectedTags.some((tag) => item.tags.includes(tag))
      );
    },
  };
};
