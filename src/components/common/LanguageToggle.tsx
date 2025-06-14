import { useLanguage } from "../../context/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ja" : "en")}
      aria-label={
        language === "en"
          ? t("settings.language.switchToJa")
          : t("settings.language.switchToEn")
      }
    >
      {language === "en" ? (
        <>
          <span>🇯🇵</span>
          <span>日本語</span>
        </>
      ) : (
        <>
          <span>🇺🇸</span>
          <span>English</span>
        </>
      )}
    </button>
  );
};

export default LanguageToggle;
