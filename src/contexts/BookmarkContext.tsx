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

const BookmarkContext = createContext<BookmarkContextType | undefined>(
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

export const useBookmark = (type: string, id: string | number) => {
  const context = useContext(BookmarkContext);

  if (context === undefined) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }

  const { isBookmarked, addBookmark, removeBookmark } = context;

  const toggleBookmark = (item?: Omit<BookmarkItem, "id" | "type">) => {
    if (isBookmarked(type, id)) {
      removeBookmark(type, id);
    } else if (item) {
      addBookmark({
        id,
        type,
        ...item,
      });
    }
  };

  return {
    isBookmarked: isBookmarked(type, id),
    toggleBookmark,
  };
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);

  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }

  return {
    bookmarks: context.bookmarks,
    loading: false,
    removeBookmark: context.removeBookmark,
    clearAllBookmarks: context.clearAllBookmarks,
  };
};
