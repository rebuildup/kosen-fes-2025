import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBookmark } from "../context/BookmarkContext";
import BookmarksList from "../components/bookmarks/BookmarksList";
import { Link } from "react-router-dom";

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
    <div>
      <h1>{t("bookmarks.title")}</h1>
      <p>{t("bookmarks.description")}</p>

      {getBookmarkCount() === 0 ? (
        <div>
          <p>{t("bookmarks.empty")}</p>
          <Link to="/">{t("navigation.home")}</Link>
        </div>
      ) : (
        <BookmarksList />
      )}
    </div>
  );
};

export default Bookmarks;
