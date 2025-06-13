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
    <header className={`fixed top-0 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-[1000] h-16 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        <nav className="h-full">
          <ul className="flex h-full m-0 p-0 list-none">
            <li className="h-full flex items-center">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-4 h-full text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative ${isActive ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600" : ""}`
                }
                end
              >
                <span className="mr-2 flex items-center justify-center text-lg">
                  <HomeIcon size={20} />
                </span>
                <span className="text-sm">{t("navigation.home")}</span>
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center px-4 h-full text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative ${isActive ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600" : ""}`
                }
              >
                <span className="mr-2 flex items-center justify-center text-lg">
                  <EventIcon size={20} />
                </span>
                <span className="text-sm">{t("navigation.events")}</span>
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink
                to="/exhibits"
                className={({ isActive }) =>
                  `flex items-center px-4 h-full text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative ${isActive ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600" : ""}`
                }
              >
                <span className="mr-2 flex items-center justify-center text-lg">
                  <ExhibitIcon size={20} />
                </span>
                <span className="text-sm">{t("navigation.exhibits")}</span>
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `flex items-center px-4 h-full text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative ${isActive ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600" : ""}`
                }
              >
                <span className="mr-2 flex items-center justify-center text-lg">
                  <ScheduleIcon size={20} />
                </span>
                <span className="text-sm">{t("navigation.schedule")}</span>
              </NavLink>
            </li>

            <li className="h-full flex items-center">
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `flex items-center px-4 h-full text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative ${isActive ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600" : ""}`
                }
              >
                <span className="mr-2 flex items-center justify-center text-lg">
                  <MapIcon size={20} />
                </span>
                <span className="text-sm">{t("navigation.map")}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
