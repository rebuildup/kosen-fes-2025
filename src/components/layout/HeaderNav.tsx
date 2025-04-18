import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

const HeaderNav: React.FC = () => {
  const { t } = useLanguage();

  // Navigation items
  const navItems = [
    { key: "home", label: t("header.home"), path: "/" },
    { key: "events", label: t("header.events"), path: "/events" },
    {
      key: "exhibitions",
      label: t("header.exhibitions"),
      path: "/exhibitions",
    },
    { key: "timetable", label: t("header.timetable"), path: "/timetable" },
    { key: "map", label: t("header.map"), path: "/map" },
  ];

  return (
    <nav className="header-nav">
      <ul className="flex space-x-1 md:space-x-2">
        {navItems.map((item) => (
          <li key={item.key}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderNav;
