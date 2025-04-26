import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { SunIcon } from "../icons/SunIcon";
import { MoonIcon } from "../icons/MoonIcon";

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
          <span className="toggle-icon">
            <MoonIcon size={16} />
          </span>
          <span className="toggle-text">{t("settings.theme.dark")}</span>
        </>
      ) : (
        <>
          <span className="toggle-icon">
            <SunIcon size={16} />
          </span>
          <span className="toggle-text">{t("settings.theme.light")}</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
