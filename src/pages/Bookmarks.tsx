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
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title">{t("bookmarks.title")}</h1>
          <p className="section-subtitle">{t("bookmarks.description")}</p>

          {getBookmarkCount() === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-lg mb-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("bookmarks.empty")}
              </p>
              <Link to="/" className="btn btn-primary">
                {t("navigation.home")}
              </Link>
            </div>
          ) : (
            <BookmarksList />
          )}
        </div>
      </section>
    </div>
  );
};

export default Bookmarks;
