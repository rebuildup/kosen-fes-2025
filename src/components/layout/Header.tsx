import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Logo from "../common/Logo";
import { HomeIcon } from "../icons/HomeIcon";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { ScheduleIcon } from "../icons/ScheduleIcon";
import { MapIcon } from "../icons/MapIcon";

const Header = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll behavior for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-color)]/90 backdrop-blur-md shadow-lg border-b border-[var(--gray-color)]/20"
          : "bg-[var(--bg-color)] shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex items-center space-x-6">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-[var(--main)] hover:text-[var(--accent)] hover:bg-[var(--bg-color)]"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center">
                    <HomeIcon size={18} />
                  </span>
                  <span>{t("navigation.home")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-[var(--main)] hover:text-[var(--accent)] hover:bg-[var(--bg-color)]"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center">
                    <EventIcon size={18} />
                  </span>
                  <span>{t("navigation.events")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/exhibits"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-[var(--main)] hover:text-[var(--accent)] hover:bg-[var(--bg-color)]"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center">
                    <ExhibitIcon size={18} />
                  </span>
                  <span>{t("navigation.exhibits")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-[var(--main)] hover:text-[var(--accent)] hover:bg-[var(--bg-color)]"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center">
                    <ScheduleIcon size={18} />
                  </span>
                  <span>{t("navigation.schedule")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-[var(--main)] hover:text-[var(--accent)] hover:bg-[var(--bg-color)]"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center">
                    <MapIcon size={18} />
                  </span>
                  <span>{t("navigation.map")}</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
