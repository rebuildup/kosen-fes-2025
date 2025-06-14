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
    <aside>
      <div>
        <h3>{t("search.title")}</h3>
        <div>
          <SearchBar variant="inline" onSearch={handleSearch} />
        </div>
      </div>

      <div>
        <h3>{t("navigation.quickLinks")}</h3>
        <div>
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

      <div>
        <h3
          onClick={() => toggleSection("settings")}
        >
          {t("settings.title")}
          <span>
            ▾
          </span>
        </h3>

        {expanded === "settings" && (
          <div>
            <div>
              <span>
                {t("settings.theme.title")}:
              </span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800">
              <span>
                {t("settings.language.title")}:
              </span>
              <LanguageToggle />
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3
          onClick={() => toggleSection("info")}
        >
          {t("info.title")}
          <span>
            ▾
          </span>
        </h3>

        {expanded === "info" && (
          <div>
            <div>
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
