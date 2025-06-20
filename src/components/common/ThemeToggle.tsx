import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { SunIcon } from "../icons/SunIcon";
import { MoonIcon } from "../icons/MoonIcon";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bg-tertiary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bg-secondary)";
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
