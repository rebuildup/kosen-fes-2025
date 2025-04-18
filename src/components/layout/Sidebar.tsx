import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import ThemeToggle from "../features/theme/ThemeToggle";
import LanguageSelector from "../features/language/LanguageSelector";
import SidebarNav from "./SidebarNav";
import SidebarSearch from "./SidebarSearch";

const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <aside className="sidebar w-64 hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-background-secondary">
      <div className="sidebar-content flex flex-col flex-grow p-4 overflow-y-auto">
        {/* Search Section */}
        <div className="mb-6">
          <SidebarSearch />
        </div>

        {/* Navigation */}
        <nav className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {t("sidebar.navigation")}
          </h2>
          <SidebarNav />
        </nav>

        {/* Settings Section */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {t("sidebar.settings")}
          </h2>

          {/* Theme Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("common.theme")}
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("common.language")}
              </span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
