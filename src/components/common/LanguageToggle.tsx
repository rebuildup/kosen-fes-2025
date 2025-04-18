import { useLanguage } from "../../context/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      className="language-toggle"
      onClick={() => setLanguage(language === "en" ? "ja" : "en")}
      aria-label={
        language === "en"
          ? t("settings.language.switchToJa")
          : t("settings.language.switchToEn")
      }
    >
      {language === "en" ? "🇯🇵 日本語" : "🇺🇸 English"}
    </button>
  );
};

export default LanguageToggle;
