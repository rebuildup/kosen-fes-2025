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
    <aside className="pc-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">{t("search.title")}</h3>
        <div className="sidebar-search">
          <SearchBar variant="inline" onSearch={handleSearch} />
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">{t("navigation.quickLinks")}</h3>
        <div className="sidebar-links">
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

      <div className="sidebar-section">
        <h3
          className="sidebar-title sidebar-title-clickable"
          onClick={() => toggleSection("settings")}
        >
          {t("settings.title")}
          <span
            className={`sidebar-arrow ${
              expanded === "settings" ? "expanded" : ""
            }`}
          >
            ▾
          </span>
        </h3>

        {expanded === "settings" && (
          <div className="sidebar-content">
            <div className="sidebar-setting">
              <span className="setting-label">
                {t("settings.theme.title")}:
              </span>
              <ThemeToggle />
            </div>

            <div className="sidebar-setting">
              <span className="setting-label">
                {t("settings.language.title")}:
              </span>
              <LanguageToggle />
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <h3
          className="sidebar-title sidebar-title-clickable"
          onClick={() => toggleSection("info")}
        >
          {t("info.title")}
          <span
            className={`sidebar-arrow ${expanded === "info" ? "expanded" : ""}`}
          >
            ▾
          </span>
        </h3>

        {expanded === "info" && (
          <div className="sidebar-content">
            <div className="sidebar-info">
              <p>{t("info.festivalDates")}: 2025/06/15 - 2025/06/16</p>
              <p>{t("info.location")}: Ube Kosen, Yamaguchi</p>
              <p>{t("info.organizer")}: Festival Committee</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
