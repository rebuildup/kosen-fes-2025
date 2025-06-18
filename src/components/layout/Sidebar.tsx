import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import ThemeToggleIcon from "../common/ThemeToggleIcon";
import LanguageToggleIcon from "../common/LanguageToggleIcon";
import SidebarLink from "./SidebarLink";
import { BookmarkIcon } from "../icons/BookmarkIcon";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { ScheduleIcon } from "../icons/ScheduleIcon";
import { MapIcon } from "../icons/MapIcon";
import { SponsorIcon } from "../icons/SponsorIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { HomeIcon } from "../icons/HomeIcon";
import { SettingsIcon } from "../icons/SettingsIcon";
import { InfoIcon } from "../icons/InfoIcon";

const Sidebar = () => {
  const { t } = useLanguage();
  const { bookmarks } = useBookmark();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Handle section expansion
  const toggleSection = (section: string) => {
    if (expanded === section) {
      setExpanded(null);
    } else {
      setExpanded(section);
    }
  };

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 xl:w-64 lg:w-16 flex-shrink-0 transition-all duration-300 z-40 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] shadow-sm">
      <div className="h-full overflow-y-auto p-6 lg:p-3">
        {/* Quick Links */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 lg:hidden xl:block">
            {t("sidebar.quickAccess")}
          </h3>
          <div className="space-y-2">
            <SidebarLink
              to="/bookmarks"
              icon={<BookmarkIcon size={18} />}
              label={t("bookmarks.title")}
              badge={bookmarks.length > 0 ? bookmarks.length : undefined}
              compact={true}
            />
            <SidebarLink
              to="/search"
              icon={<SearchIcon size={18} />}
              label={t("search.title")}
              compact={true}
            />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 lg:hidden xl:block">
            {t("sidebar.navigation")}
          </h3>
          <div className="space-y-2">
            <SidebarLink
              to="/"
              icon={<HomeIcon size={18} />}
              label={t("navigation.home")}
              compact={true}
            />
            <SidebarLink
              to="/events"
              icon={<EventIcon size={18} />}
              label={t("navigation.events")}
              compact={true}
            />
            <SidebarLink
              to="/exhibits"
              icon={<ExhibitIcon size={18} />}
              label={t("navigation.exhibits")}
              compact={true}
            />
            <SidebarLink
              to="/schedule"
              icon={<ScheduleIcon size={18} />}
              label={t("navigation.schedule")}
              compact={true}
            />
            <SidebarLink
              to="/map"
              icon={<MapIcon size={18} />}
              label={t("navigation.map")}
              compact={true}
            />
            <SidebarLink
              to="/sponsors"
              icon={<SponsorIcon size={18} />}
              label={t("navigation.sponsors")}
              compact={true}
            />
          </div>
        </div>

        {/* Settings Section */}
        <div className="mb-6">
          {/* Wide sidebar: Show expandable settings */}
          <div className="lg:hidden xl:block">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                {t("sidebar.settings")}
              </h3>
              <button
                onClick={() => toggleSection("settings")}
                className={`
                  p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                  ${
                    expanded === "settings"
                      ? "bg-[var(--instagram-gradient-subtle)] text-[var(--primary-color)] shadow-sm"
                      : "bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)]"
                  }
                `}
                title={t("settings.title")}
              >
                <SettingsIcon size={18} />
              </button>
            </div>

            {expanded === "settings" && (
              <div className="space-y-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {t("settings.theme.title")}:
                  </span>
                  <ThemeToggleIcon />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {t("settings.language.title")}:
                  </span>
                  <LanguageToggleIcon />
                </div>
              </div>
            )}
          </div>

          {/* Compact sidebar: Show icon-only controls */}
          <div className="hidden lg:block xl:hidden space-y-2">
            {/* Theme toggle button */}
            <div className="relative group">
              <div className="p-3 rounded-lg transition-all duration-200 flex items-center justify-center bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)]">
                <ThemeToggleIcon />
              </div>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 border border-[var(--border-color)] shadow-lg">
                {t("settings.theme.title")}
              </div>
            </div>

            {/* Language toggle button */}
            <div className="relative group">
              <div className="p-3 rounded-lg transition-all duration-200 flex items-center justify-center bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)]">
                <LanguageToggleIcon />
              </div>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 border border-[var(--border-color)] shadow-lg">
                {t("settings.language.title")}
              </div>
            </div>

            {/* Settings icon button */}
            <div className="relative group">
              <button
                onClick={() => toggleSection("settings")}
                className="w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-center bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)]"
                title={t("settings.title")}
              >
                <SettingsIcon size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 border border-[var(--border-color)] shadow-lg">
                {t("settings.title")}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-6">
          {/* Wide sidebar: Show expandable info */}
          <div className="lg:hidden xl:block">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                {t("sidebar.information")}
              </h3>
              <button
                onClick={() => toggleSection("info")}
                className={`
                  p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                  ${
                    expanded === "info"
                      ? "bg-[var(--instagram-gradient-subtle)] text-[var(--primary-color)] shadow-sm"
                      : "bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)]"
                  }
                `}
                title={t("info.title")}
              >
                <InfoIcon size={18} />
              </button>
            </div>

            {expanded === "info" && (
              <div className="space-y-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {t("info.festivalDates")}:
                    </span>
                    <br />
                    <span className="text-[var(--text-secondary)]">
                      2025/06/15 - 2025/06/16
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {t("info.location")}:
                    </span>
                    <br />
                    <span className="text-[var(--text-secondary)]">
                      {t("info.schoolName")}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {t("info.access")}:
                    </span>
                    <br />
                    <span className="text-[var(--text-secondary)]">
                      {t("info.accessInfo")}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {t("info.organizer")}:
                    </span>
                    <br />
                    <span className="text-[var(--text-secondary)]">
                      宇部高専祭実行委員会
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compact sidebar: Show icon-only info button */}
          <div className="hidden lg:block xl:hidden">
            <div className="relative group">
              <button
                onClick={() => toggleSection("info")}
                className="w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-center bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)]"
                title={t("info.title")}
              >
                <InfoIcon size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 border border-[var(--border-color)] shadow-lg">
                {t("info.title")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
