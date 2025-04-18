import React from "react";
import { useTheme } from "../features/theme/ThemeContext";
import { useLanguage } from "../features/language/LanguageContext";

interface ThemeSettingsProps {
  className?: string;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ className = "" }) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`theme-settings ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{t("settings.appearance")}</h3>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            {t("settings.theme")}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme("light")}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === "light"
                  ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
              aria-label={t("settings.lightMode")}
              aria-pressed={theme === "light"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === "dark"
                  ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
              aria-label={t("settings.darkMode")}
              aria-pressed={theme === "dark"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className="ml-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {theme === "light"
                ? t("settings.switchToDark")
                : t("settings.switchToLight")}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("settings.themeDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
