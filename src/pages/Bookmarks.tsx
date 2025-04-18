import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBookmark } from "../context/BookmarkContext";
import BookmarksList from "../components/bookmarks/BookmarksList";

const Bookmarks = () => {
  const { t } = useLanguage();
  const { getBookmarkCount } = useBookmark();

  // Set page title
  useEffect(() => {
    document.title = `${t("bookmarks.title")} (${getBookmarkCount()}) | ${t(
      "siteName"
    )}`;

    // Restore original title when component unmounts
    return () => {
      document.title = t("siteName");
    };
  }, [t, getBookmarkCount]);

  return (
    <div className="bookmarks-page">
      <h1 className="bookmarks-title">{t("bookmarks.title")}</h1>
      <p className="bookmarks-description">{t("bookmarks.description")}</p>

      <BookmarksList />
    </div>
  );
};

export default Bookmarks;
