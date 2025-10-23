import { useEffect } from "react";
import PillButton from "../components/common/PillButton";

import BookmarksList from "../components/bookmarks/BookmarksList";
import { useBookmark } from "../context/BookmarkContext";
import { useLanguage } from "../context/LanguageContext";

const Bookmarks = () => {
  const { t } = useLanguage();
  const { getBookmarkCount } = useBookmark();

  // Set page title
  useEffect(() => {
    document.title = `${t("bookmarks.title")} (${getBookmarkCount()}) | ${t("siteName")}`;

    // Restore original title when component unmounts
    return () => {
      document.title = t("siteName");
    };
  }, [t, getBookmarkCount]);

  return (
    <div className="min-h-screen">
      <section className="section" style={{ backgroundColor: "var(--color-bg-primary)" }}>
        <div className="mx-auto max-w-7xl">
          <h1 className="section-title">{t("bookmarks.title")}</h1>
          <p className="section-subtitle">{t("bookmarks.description")}</p>

          {getBookmarkCount() === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-6 text-lg" style={{ color: "var(--color-text-secondary)" }}>
                {t("bookmarks.empty")}
              </p>
              <PillButton to="/" className="btn btn-primary">
                {t("navigation.home")}
              </PillButton>
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
