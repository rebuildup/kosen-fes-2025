import { useContext } from "react";
import BookmarkContext from "../components/features/bookmark/BookmarkContext";

/**
 * Custom hook for accessing bookmark context throughout the application
 * @returns Bookmark context values
 */
const useBookmark = () => {
  const context = useContext(BookmarkContext);

  if (context === undefined) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }

  return context;
};

export default useBookmark;
