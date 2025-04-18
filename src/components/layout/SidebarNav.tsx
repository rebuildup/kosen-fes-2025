import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

const SidebarNav: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    {
      key: "bookmarks",
      label: t("sidebar.bookmarks"),
      path: "/bookmarks",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ),
    },
    {
      key: "search",
      label: t("sidebar.search"),
      path: "/search",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <ul className="space-y-2">
      {navItems.map((item) => (
        <li key={item.key}>
          <NavLink
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${
                isActive
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNav;
