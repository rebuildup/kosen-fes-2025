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
      aria-label={
        theme === "light"
          ? t("settings.theme.switchToDark")
          : t("settings.theme.switchToLight")
      }
    >
      {theme === "light" ? (
        <>
          <span>
            <MoonIcon size={16} />
          </span>
          <span>{t("settings.theme.dark")}</span>
        </>
      ) : (
        <>
          <span>
            <SunIcon size={16} />
          </span>
          <span>{t("settings.theme.light")}</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
