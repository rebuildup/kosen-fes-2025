import { useState } from "react";

import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggleIcon from "../common/LanguageToggleIcon";
import ThemeToggleIcon from "../common/ThemeToggleIcon";
import {
  BookmarkIcon,
  EventIcon,
  ExhibitIcon,
  HomeIcon,
  InfoIcon,
  MapIcon,
  ScheduleIcon,
  SearchIcon,
  SponsorIcon,
} from "../icons";
import SidebarLink from "./SidebarLink";

const Sidebar = () => {
  const { t } = useLanguage();
  const { bookmarks } = useBookmark();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Handle section expansion (only for info section now)
  const toggleSection = (section: string) => {
    if (expanded === section) {
      setExpanded(null);
    } else {
      setExpanded(section);
    }
  };

  return (
    <aside className="glass-subtle sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r border-[var(--border-color)] transition-all duration-300 lg:w-16 xl:w-64">
      <div className="scrollbar-hide h-full overflow-y-auto p-6 lg:p-3">
        {/* Quick Links */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase lg:hidden xl:block">
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
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase lg:hidden xl:block">
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
          {/* Wide sidebar: Show settings always visible */}
          <div className="lg:hidden xl:block">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
              {t("sidebar.settings")}
            </h3>

            <div className="space-y-3">
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
          </div>

          {/* Compact sidebar: Show icon-only controls */}
          <div className="hidden space-y-2 lg:block xl:hidden">
            {/* Theme toggle button */}
            <div className="group relative">
              <div className="glass-button glass-interactive flex items-center justify-center rounded-lg p-3 transition-all duration-200">
                <ThemeToggleIcon />
              </div>
              {/* Tooltip */}
              <div className="glass-effect pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 transform rounded-md px-2 py-1 text-xs whitespace-nowrap text-[var(--text-primary)] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {t("settings.theme.title")}
              </div>
            </div>

            {/* Language toggle button */}
            <div className="group relative">
              <div className="glass-button glass-interactive flex items-center justify-center rounded-lg p-3 transition-all duration-200">
                <LanguageToggleIcon />
              </div>
              {/* Tooltip */}
              <div className="glass-effect pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 transform rounded-md px-2 py-1 text-xs whitespace-nowrap text-[var(--text-primary)] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {t("settings.language.title")}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-6">
          {/* Wide sidebar: Show expandable info */}
          <div className="lg:hidden xl:block">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                {t("sidebar.information")}
              </h3>
              <button
                onClick={() => toggleSection("info")}
                className={`flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                  expanded === "info"
                    ? "glass-bold text-[var(--primary-color)] shadow-sm"
                    : "glass-button glass-interactive text-[var(--text-primary)] hover:text-[var(--primary-color)]"
                } `}
                title={t("info.title")}
              >
                <InfoIcon size={18} />
              </button>
            </div>

            {expanded === "info" && (
              <div className="glass-card space-y-2 rounded-lg border border-[var(--border-color)] p-3">
                <div className="space-y-1.5">
                  <div className="text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {t("info.festivalDates")}:
                    </span>
                    <br />
                    <span className="text-[var(--text-secondary)]">
                      2025/11/08 - 2025/11/09
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {t("info.location")}:
                    </span>
                    <br />
                    <span className="text-[var(--text-secondary)]">
                      {t("info.schoolName")}
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {t("info.access")}:
                    </span>
                    <br />
                    <span className="text-[var(--text-secondary)]">
                      {t("info.accessInfo")}
                    </span>
                  </div>

                  <div className="text-xs">
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
            <div className="group relative">
              <button
                onClick={() => toggleSection("info")}
                className="glass-button glass-interactive flex w-full items-center justify-center rounded-lg p-3 transition-all duration-200 hover:text-[var(--primary-color)]"
                title={t("info.title")}
              >
                <InfoIcon size={18} />
              </button>
              {/* Tooltip */}
              <div className="glass-effect pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 transform rounded-md px-2 py-1 text-xs whitespace-nowrap text-[var(--text-primary)] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
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
