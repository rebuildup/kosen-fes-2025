import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import SearchBar from "../common/SearchBar";

interface MenuProps {
  setMenuOpen: (open: boolean) => void;
}

const Menu = ({ setMenuOpen }: MenuProps) => {
  const { t } = useLanguage();

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="mobile-menu">
      <div className="menu-header">
        <button
          className="close-button"
          onClick={() => setMenuOpen(false)}
          aria-label={t("actions.close")}
        >
          ✕
        </button>
      </div>

      <div className="menu-search">
        <SearchBar variant="inline" onSearch={handleMenuItemClick} />
      </div>

      <div className="menu-items">
        <Link to="/bookmarks" onClick={handleMenuItemClick}>
          {t("navigation.bookmarks")}
        </Link>

        <div className="menu-settings">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
};

export default Menu;
