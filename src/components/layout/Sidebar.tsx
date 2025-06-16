import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import SidebarLink from "./SidebarLink";
import { BookmarkIcon } from "../icons/BookmarkIcon";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { ScheduleIcon } from "../icons/ScheduleIcon";
import { MapIcon } from "../icons/MapIcon";
import { SponsorIcon } from "../icons/SponsorIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { HomeIcon } from "../icons/HomeIcon";

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
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 xl:w-64 lg:w-16 flex-shrink-0 sidebar transition-all duration-300 z-40">
      <div className="h-full overflow-y-auto p-6 lg:p-3">
        {/* Quick Links */}
        <div className="mb-6">
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("sidebar.quickLinks")}
          </h3>
          <div className="space-y-2 mb-6">
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
          <div className="space-y-2 mb-6">
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
          <h3
            onClick={() => toggleSection("settings")}
            className="text-sm font-semibold mb-3 cursor-pointer hover:text-[var(--color-accent)] transition-colors flex items-center justify-between lg:hidden xl:flex"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span className="lg:hidden xl:inline">{t("settings.title")}</span>
            <span
              className={`transform transition-transform ${
                expanded === "settings" ? "rotate-180" : ""
              } lg:hidden xl:inline`}
            >
              ▾
            </span>
          </h3>

          {/* Settings toggle for compact mode */}
          <div className="lg:block xl:hidden mb-3">
            <button
              onClick={() => toggleSection("settings")}
              className="w-full p-3 rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-bg-secondary)";
              }}
              title={t("settings.title")}
            >
              ⚙️
            </button>
          </div>

          {expanded === "settings" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("settings.theme.title")}:
                </span>
                <ThemeToggle />
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("settings.language.title")}:
                </span>
                <LanguageToggle />
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mb-6">
          <h3
            onClick={() => toggleSection("info")}
            className="text-sm font-semibold mb-3 cursor-pointer hover:text-[var(--color-accent)] transition-colors flex items-center justify-between lg:hidden xl:flex"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span className="lg:hidden xl:inline">{t("info.title")}</span>
            <span
              className={`transform transition-transform ${
                expanded === "info" ? "rotate-180" : ""
              } lg:hidden xl:inline`}
            >
              ▾
            </span>
          </h3>

          {/* Info toggle for compact mode */}
          <div className="lg:block xl:hidden mb-3">
            <button
              onClick={() => toggleSection("info")}
              className="w-full p-3 rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-bg-secondary)";
              }}
              title={t("info.title")}
            >
              ℹ️
            </button>
          </div>

          {expanded === "info" && (
            <div className="space-y-3">
              <div
                className="p-3 rounded-md"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <p
                  className="text-sm mb-1 lg:text-xs xl:text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <strong
                    className="lg:hidden xl:inline"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("info.festivalDates")}:
                  </strong>
                  <span className="lg:block xl:inline">
                    {" "}
                    2025/11/8 - 2025/11/9
                  </span>
                </p>
                <p
                  className="text-sm mb-1 lg:text-xs xl:text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <strong
                    className="lg:hidden xl:inline"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("info.location")}:
                  </strong>
                  <span className="lg:block xl:inline">
                    {" "}
                    Ube Kosen, Yamaguchi
                  </span>
                </p>
                <p
                  className="text-sm lg:text-xs xl:text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <strong
                    className="lg:hidden xl:inline"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("info.organizer")}:
                  </strong>
                  <span className="lg:block xl:inline">
                    {" "}
                    Festival Committee
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
