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
      {language === "en" ? (
        <>
          <span className="toggle-icon">🇯🇵</span>
          <span className="toggle-text">日本語</span>
        </>
      ) : (
        <>
          <span className="toggle-icon">🇺🇸</span>
          <span className="toggle-text">English</span>
        </>
      )}
    </button>
  );
};

export default LanguageToggle;
