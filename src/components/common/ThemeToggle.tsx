import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { SunIcon, MoonIcon } from "../icons";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <span className="flex-shrink-0">
            <MoonIcon size={16} />
          </span>
          <span className="text-sm font-medium">
            {t("settings.theme.dark")}
          </span>
        </>
      ) : (
        <>
          <span className="flex-shrink-0">
            <SunIcon size={16} />
          </span>
          <span className="text-sm font-medium">
            {t("settings.theme.light")}
          </span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
