import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SearchResult } from '../../../types/common';
import { useLanguage } from '../../../hooks/useLanguage';
import {
  getBookmarks,
  saveBookmarks,
  isBookmarked as checkIsBookmarked
} from '../../../services/bookmarkService';

interface BookmarkContextType {
  bookmarks: SearchResult[];
  addBookmark: (item: SearchResult) => void;
  removeBookmark: (id: string, type: string) => void;
  isBookmarked: (id: string, type: string) => boolean;
  toggleBookmark: (item: SearchResult) => void;
  clearAllBookmarks: () => void;
  showToast: (message: string) => void;
  toast: {
    message: string;
    isVisible: boolean;
  };
}

// Create context with default values
const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
  toggleBookmark: () => {},
  clearAllBookmarks: () => {},
  showToast: () => {},
  toast: {
    message: '',
    isVisible: false
  }
});

// Custom hook for using bookmarks
export const useBookmark = () => useContext(BookmarkContext);

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useState<SearchResult[]>([]);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
    message: '',
    isVisible: false
  });
  
  // Initialize bookmarks from localStorage
  useEffect(() => {
    const storedBookmarks = getBookmarks();
    setBookmarks(storedBookmarks);
  }, []);
  
  // Add a bookmark
  const addBookmark = (item: SearchResult) => {
    if (!isBookmarked(item.id, item.type)) {
      const updatedBookmarks = [...bookmarks, item];
      saveBookmarks(updatedBookmarks);
      setBookmarks(updatedBookmarks);
      showToast(t('bookmarks.added'));
    }
  };
  
  // Remove a bookmark
  const removeBookmark = (id: string, type: string) => {
    const updatedBookmarks = bookmarks.filter(
      bookmark => !(bookmark.id === id && bookmark.type === type)
    );
    
    saveBookmarks(updatedBookmarks);
    setBookmarks(updatedBookmarks);
    showToast(t('bookmarks.removed'));
  };
  
  // Check if an item is bookmarked
  const isBookmarked = (id: string, type: string): boolean => {
    return checkIsBookmarked(id, type);
  };
  
  // Toggle bookmark status
  const toggleBookmark = (item: SearchResult) => {
    if (isBookmarked(item.id, item.type)) {
      removeBookmark(item.id, item.type);
    } else {
      addBookmark(item);
    }
  };
  
  // Clear all bookmarks
  const clearAllBookmarks = () => {
    saveBookmarks([]);
    setBookmarks([]);
    showToast(t('bookmarks.allCleared'));
  };
  
  // Show toast notification
  const showToast = (message: string) => {
    setToast({
      message,
      isVisible: true
    });
    
    // Hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({
        ...prev,
        isVisible: false
      }));
    }, 3000);
  };
  
  const value = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    clearAllBookmarks,
    showToast,
    toast
  };
  
  return (
    <BookmarkContext.Provider value={value}>
      {children}
      
      {/* Toast notification */}
      {toast.isVisible && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
          {toast.message}
        </div>
      )}
    </BookmarkContext.Provider>
  );
};

export default BookmarkContext;