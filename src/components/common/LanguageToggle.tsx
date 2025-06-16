import { useLanguage } from "../../context/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ja" : "en")}
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
      aria-label={
        language === "en"
          ? t("settings.language.switchToJa")
          : t("settings.language.switchToEn")
      }
    >
      {language === "en" ? (
        <>
          <span className="flex-shrink-0">🇯🇵</span>
          <span className="text-sm font-medium">日本語</span>
        </>
      ) : (
        <>
          <span className="flex-shrink-0">🇺🇸</span>
          <span className="text-sm font-medium">English</span>
        </>
      )}
    </button>
  );
};

export default LanguageToggle;
