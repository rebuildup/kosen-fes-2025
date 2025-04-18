import { useRef, useEffect, RefObject } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import SearchBar from "../common/SearchBar";

interface MenuProps {
  setMenuOpen: (open: boolean) => void;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
}

const Menu = ({ setMenuOpen, closeButtonRef }: MenuProps) => {
  const { t } = useLanguage();
  const { bookmarks } = useBookmark();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Add event listener for clicks outside menu
    document.addEventListener("mousedown", handleClickOutside);

    // Handle escape key press
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [setMenuOpen]);

  // Handle menu item click to close the menu
  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="menu-overlay">
      <div className="menu-backdrop" onClick={() => setMenuOpen(false)}></div>

      <div className="mobile-menu" ref={menuRef}>
        <div className="menu-header">
          <button
            className="menu-close-button"
            onClick={() => setMenuOpen(false)}
            aria-label={t("actions.close")}
            ref={closeButtonRef}
          >
            <span className="menu-close-icon">✕</span>
          </button>
          <div className="menu-title">{t("navigation.menu")}</div>
        </div>

        <div className="menu-search">
          <SearchBar variant="default" onSearch={handleMenuItemClick} />
        </div>

        <div className="menu-section">
          <h3 className="menu-section-title">{t("navigation.main")}</h3>
          <nav className="menu-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `menu-nav-item ${isActive ? "menu-nav-active" : ""}`
              }
              onClick={handleMenuItemClick}
              end
            >
              <span className="menu-nav-icon">🏠</span>
              <span className="menu-nav-label">{t("navigation.home")}</span>
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                `menu-nav-item ${isActive ? "menu-nav-active" : ""}`
              }
              onClick={handleMenuItemClick}
            >
              <span className="menu-nav-icon">🎭</span>
              <span className="menu-nav-label">{t("navigation.events")}</span>
            </NavLink>

            <NavLink
              to="/exhibits"
              className={({ isActive }) =>
                `menu-nav-item ${isActive ? "menu-nav-active" : ""}`
              }
              onClick={handleMenuItemClick}
            >
              <span className="menu-nav-icon">🖼️</span>
              <span className="menu-nav-label">{t("navigation.exhibits")}</span>
            </NavLink>

            <NavLink
              to="/schedule"
              className={({ isActive }) =>
                `menu-nav-item ${isActive ? "menu-nav-active" : ""}`
              }
              onClick={handleMenuItemClick}
            >
              <span className="menu-nav-icon">📅</span>
              <span className="menu-nav-label">{t("navigation.schedule")}</span>
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) =>
                `menu-nav-item ${isActive ? "menu-nav-active" : ""}`
              }
              onClick={handleMenuItemClick}
            >
              <span className="menu-nav-icon">🗺️</span>
              <span className="menu-nav-label">{t("navigation.map")}</span>
            </NavLink>
          </nav>
        </div>

        <div className="menu-section">
          <h3 className="menu-section-title">{t("navigation.quickLinks")}</h3>
          <div className="menu-links">
            <Link
              to="/bookmarks"
              className="menu-link-item"
              onClick={handleMenuItemClick}
            >
              <span className="menu-link-icon">🔖</span>
              <span className="menu-link-label">{t("bookmarks.title")}</span>
              {bookmarks.length > 0 && (
                <span className="menu-link-badge">{bookmarks.length}</span>
              )}
            </Link>

            <Link
              to="/search"
              className="menu-link-item"
              onClick={handleMenuItemClick}
            >
              <span className="menu-link-icon">🔍</span>
              <span className="menu-link-label">{t("search.title")}</span>
            </Link>
          </div>
        </div>

        <div className="menu-section">
          <h3 className="menu-section-title">{t("settings.title")}</h3>
          <div className="menu-settings">
            <div className="menu-setting-item">
              <span className="menu-setting-label">
                {t("settings.theme.title")}
              </span>
              <ThemeToggle />
            </div>

            <div className="menu-setting-item">
              <span className="menu-setting-label">
                {t("settings.language.title")}
              </span>
              <LanguageToggle />
            </div>
          </div>
        </div>

        <div className="menu-section">
          <h3 className="menu-section-title">{t("info.title")}</h3>
          <div className="menu-info">
            <p>{t("info.festivalDates")}: 2025/06/15 - 2025/06/16</p>
            <p>{t("info.location")}: Ube Kosen, Yamaguchi</p>
            <p>{t("info.organizer")}: Festival Committee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
