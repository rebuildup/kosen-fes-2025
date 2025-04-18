// src/hooks/useBookmark.ts
import { useContext } from "react";
import BookmarkContext from "../components/features/bookmark/BookmarkContext";

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }
  return context;
};

export default useBookmark;
