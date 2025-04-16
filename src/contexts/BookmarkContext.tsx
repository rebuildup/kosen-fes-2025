// src/contexts/BookmarkContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

export interface BookmarkItem {
  id: string | number;
  type: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (type: string, id: string | number) => void;
  isBookmarked: (type: string, id: string | number) => boolean;
  clearAllBookmarks: () => void;
}

export const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const savedBookmarks = localStorage.getItem("kosen-fest-bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("kosen-fest-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: BookmarkItem) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (bookmark) =>
          bookmark.id.toString() === item.id.toString() &&
          bookmark.type === item.type
      );

      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeBookmark = (type: string, id: string | number) => {
    setBookmarks((prev) =>
      prev.filter(
        (bookmark) =>
          !(bookmark.id.toString() === id.toString() && bookmark.type === type)
      )
    );
  };

  const isBookmarked = (type: string, id: string | number) => {
    return bookmarks.some(
      (bookmark) =>
        bookmark.id.toString() === id.toString() && bookmark.type === type
    );
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        clearAllBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

// Create a hook for using the bookmark context
export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider"
    );
  }
  return context;
};
