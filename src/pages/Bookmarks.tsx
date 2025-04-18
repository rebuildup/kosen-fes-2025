import { useLanguage } from "../context/LanguageContext";
import BookmarksList from "../components/bookmarks/BookmarksList";

const Bookmarks = () => {
  const { t } = useLanguage();

  return (
    <div className="bookmarks-page">
      <h2>{t("bookmarks.title")}</h2>
      <p className="bookmarks-description">{t("bookmarks.description")}</p>

      <BookmarksList />
    </div>
  );
};

export default Bookmarks;
