import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import SearchBar from "../common/SearchBar";

const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="search-container">
        <SearchBar variant="inline" />
      </div>

      <div className="navigation">
        <Link to="/bookmarks" className="sidebar-link">
          {t("navigation.bookmarks")}
        </Link>
      </div>

      <div className="settings">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
