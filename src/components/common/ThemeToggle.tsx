import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        theme === "light"
          ? t("settings.theme.switchToDark")
          : t("settings.theme.switchToLight")
      }
    >
      {theme === "light" ? (
        <>
          <span className="icon">🌙</span>
          <span>{t("settings.theme.dark")}</span>
        </>
      ) : (
        <>
          <span className="icon">☀️</span>
          <span>{t("settings.theme.light")}</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
