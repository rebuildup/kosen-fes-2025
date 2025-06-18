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
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 xl:w-64 lg:w-16 flex-shrink-0 transition-all duration-300 z-40 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] rounded-lg shadow-sm">
      <div className="h-full overflow-y-auto p-6 lg:p-3">
        {/* Quick Links */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
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
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
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
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
            {t("sidebar.settings")}
          </h3>

          {/* Settings toggle button */}
          <button
            onClick={() => toggleSection("settings")}
            className={`
              w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-center
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

          {expanded === "settings" && (
            <div className="mt-3 space-y-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
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

        {/* Info Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
            {t("sidebar.information")}
          </h3>

          {/* Info toggle button */}
          <button
            onClick={() => toggleSection("info")}
            className={`
              w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-center
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

          {expanded === "info" && (
            <div className="mt-3 space-y-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {t("info.festivalDates")}:
                  </span>
                  <br />
                  <span className="text-[var(--text-secondary)]">
                    2025/11/8 - 2025/11/9
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
              </div>
            </div>
          )}
        </div>

        {/* Festival Stats */}
        <div className="bg-gradient-to-br from-[var(--accent-purple)]/10 to-[var(--accent-pink)]/10 rounded-lg p-4 border border-[var(--primary-color)]/20">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
            {t("sidebar.festivalStats")}
          </h4>
          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            <div className="flex justify-between">
              <span>🎭 {t("navigation.events")}</span>
              <span className="font-medium text-[var(--primary-color)]">
                14+
              </span>
            </div>
            <div className="flex justify-between">
              <span>🎨 {t("navigation.exhibits")}</span>
              <span className="font-medium text-[var(--primary-color)]">
                16+
              </span>
            </div>
            <div className="flex justify-between">
              <span>🍜 {t("navigation.stalls")}</span>
              <span className="font-medium text-[var(--primary-color)]">
                23+
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
