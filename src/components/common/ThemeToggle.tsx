import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunIcon } from "../icons";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:outline-none"
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
          <span className="text-sm font-medium">{t("settings.theme.dark")}</span>
        </>
      ) : (
        <>
          <span className="flex-shrink-0">
            <SunIcon size={16} />
          </span>
          <span className="text-sm font-medium">{t("settings.theme.light")}</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
