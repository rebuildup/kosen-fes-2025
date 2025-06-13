import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import SearchBar from "../common/SearchBar";
import SidebarLink from "./SidebarLink";
import { BookmarkIcon } from "../icons/BookmarkIcon";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { ScheduleIcon } from "../icons/ScheduleIcon";
import { MapIcon } from "../icons/MapIcon";
import { SponsorIcon } from "../icons/SponsorIcon";

const Sidebar = () => {
  const { t } = useLanguage();
  const { bookmarks } = useBookmark();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Handle section expansion
  const toggleSection = (section: string) => {
    if (expanded === section) {
      setExpanded(null);
    } else {
      setExpanded(section);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    navigate("/search");
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 h-[calc(100vh-64px)] fixed top-16 left-0 overflow-y-auto flex-shrink-0 transition-colors duration-300 z-[999] md:block hidden">
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">{t("search.title")}</h3>
        <div className="mt-2">
          <SearchBar variant="inline" onSearch={handleSearch} />
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">{t("navigation.quickLinks")}</h3>
        <div className="flex flex-col mt-1">
          <SidebarLink
            to="/bookmarks"
            icon={<BookmarkIcon size={18} />}
            label={t("bookmarks.title")}
            badge={bookmarks.length || undefined}
          />
          <SidebarLink
            to="/events"
            icon={<EventIcon size={18} />}
            label={t("navigation.events")}
          />
          <SidebarLink
            to="/exhibits"
            icon={<ExhibitIcon size={18} />}
            label={t("navigation.exhibits")}
          />
          <SidebarLink
            to="/schedule"
            icon={<ScheduleIcon size={18} />}
            label={t("navigation.schedule")}
          />
          <SidebarLink
            to="/map"
            icon={<MapIcon size={18} />}
            label={t("navigation.map")}
          />
          <SidebarLink
            to="/sponsors"
            icon={<SponsorIcon size={18} />}
            label={t("navigation.sponsors")}
          />
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3
          className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center justify-between"
          onClick={() => toggleSection("settings")}
        >
          {t("settings.title")}
          <span
            className={`transition-transform duration-200 text-sm ${
              expanded === "settings" ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </h3>

        {expanded === "settings" && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("settings.theme.title")}:
              </span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("settings.language.title")}:
              </span>
              <LanguageToggle />
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3
          className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center justify-between"
          onClick={() => toggleSection("info")}
        >
          {t("info.title")}
          <span
            className={`transition-transform duration-200 text-sm ${expanded === "info" ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </h3>

        {expanded === "info" && (
          <div className="mt-2">
            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p className="mb-2">{t("info.festivalDates")}: 2025/06/15 - 2025/06/16</p>
              <p className="mb-2">{t("info.location")}: Ube Kosen, Yamaguchi</p>
              <p>{t("info.organizer")}: Festival Committee</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
