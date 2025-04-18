import { SearchResult } from '../types/common';

const BOOKMARK_STORAGE_KEY = 'ube_festival_bookmarks';

/**
 * Get all bookmarks from localStorage
 * @returns Array of bookmarked items
 */
export const getBookmarks = (): SearchResult[] => {
  try {
    const bookmarksJson = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
};

/**
 * Save bookmarks to localStorage
 * @param bookmarks Array of bookmarked items
 */
export const saveBookmarks = (bookmarks: SearchResult[]): void => {
  try {
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
    
    // Dispatch a custom event for cross-tab synchronization
    window.dispatchEvent(new CustomEvent('bookmarks-updated'));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
};

/**
 * Add an item to bookmarks
 * @param item Item to bookmark
 * @returns Updated array of bookmarks
 */
export const addBookmark = (item: SearchResult): SearchResult[] => {
  const bookmarks = getBookmarks();
  
  // Check if item is already bookmarked
  if (!bookmarks.some(bookmark => bookmark.id === item.id && bookmark.type === item.type)) {
    const updatedBookmarks = [...bookmarks, item];
    saveBookmarks(updatedBookmarks);
    return updatedBookmarks;
  }
  
  return bookmarks;
};

/**
 * Remove an item from bookmarks
 * @param id Item ID
 * @param type Item type
 * @returns Updated array of bookmarks
 */
export const removeBookmark = (id: string, type: string): SearchResult[] => {
  const bookmarks = getBookmarks();
  const updatedBookmarks = bookmarks.filter(
    bookmark => !(bookmark.id === id && bookmark.type === type)
  );
  
  saveBookmarks(updatedBookmarks);
  return updatedBookmarks;
};

/**
 * Check if an item is bookmarked
 * @param id Item ID
 * @param type Item type
 * @returns Boolean indicating if item is bookmarked
 */
export const isBookmarked = (id: string, type: string): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some(bookmark => bookmark.id === id && bookmark.type === type);
};

/**
 * Filter bookmarks by type
 * @param type Item type to filter by
 * @returns Filtered array of bookmarks
 */
export const getBookmarksByType = (type: string): SearchResult[] => {
  const bookmarks = getBookmarks();
  return bookmarks.filter(bookmark => bookmark.type === type);
};

/**
 * Clear all bookmarks
 * @returns Empty array
 */
export const clearAllBookmarks = (): SearchResult[] => {
  saveBookmarks([]);
  return [];
};

/**
 * Export bookmarks as JSON string
 * @returns JSON string of bookmarks
 */
export const exportBookmarks = (): string => {
  const bookmarks = getBookmarks();
  return JSON.stringify(bookmarks);
};

/**
 * Import bookmarks from JSON string
 * @param jsonString JSON string of bookmarks
 * @returns Imported bookmarks array
 */
export const importBookmarks = (jsonString: string): SearchResult[] => {
  try {
    const bookmarks = JSON.parse(jsonString) as SearchResult[];
    saveBookmarks(bookmarks);
    return bookmarks;
  } catch (error) {
    console.error('Failed to import bookmarks:', error);
    return getBookmarks();
  }
};