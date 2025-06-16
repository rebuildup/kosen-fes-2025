import { useLanguage } from "../../context/LanguageContext";
import { JPIcon, ENIcon } from "../icons/LanguageIcon";

const LanguageToggleIcon = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ja" : "en")}
      className="p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
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
      aria-label={
        language === "en"
          ? t("settings.language.switchToJa")
          : t("settings.language.switchToEn")
      }
      title={language === "en" ? "日本語に切り替え" : "Switch to English"}
    >
      {language === "en" ? <JPIcon size={16} /> : <ENIcon size={16} />}
    </button>
  );
};

export default LanguageToggleIcon;
