import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import ThemeToggle from "../features/theme/ThemeToggle";
import LanguageSelector from "../features/language/LanguageSelector";
import SearchBar from "../features/search/SearchBar";
import Logo from "../common/Logo";

interface MobileMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuPanel: React.FC<MobileMenuPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();

  // Main navigation items
  const mainNavItems = [
    { key: "home", label: t("header.home"), path: "/" },
    { key: "events", label: t("header.events"), path: "/events" },
    {
      key: "exhibitions",
      label: t("header.exhibitions"),
      path: "/exhibitions",
    },
    { key: "timetable", label: t("header.timetable"), path: "/timetable" },
    { key: "map", label: t("header.map"), path: "/map" },
  ];

  // Sidebar functions
  const sidebarItems = [
    { key: "bookmarks", label: t("sidebar.bookmarks"), path: "/bookmarks" },
    { key: "search", label: t("sidebar.search"), path: "/search" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`mobile-menu-panel fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-background-secondary shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-heading"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
          <Logo className="h-8 w-auto mr-2" />
          <h2 id="mobile-menu-heading" className="text-lg font-bold">
            {t("home.title")}
          </h2>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Search */}
          <div className="mb-6">
            <SearchBar onSearchSubmit={onClose} />
          </div>

          {/* Main Navigation */}
          <nav className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t("header.navigation")}
            </h3>
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                      ${
                        isActive
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Functions */}
          <nav className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t("sidebar.navigation")}
            </h3>
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                      ${
                        isActive
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Settings */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t("sidebar.settings")}
            </h3>

            {/* Theme */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("common.theme")}
                </span>
                <ThemeToggle />
              </div>
            </div>

            {/* Language */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("common.language")}
                </span>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenuPanel;
