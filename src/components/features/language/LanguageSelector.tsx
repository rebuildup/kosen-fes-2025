import React from "react";
import { useLanguage } from "./LanguageContext";
import { Language } from "../../../types/common";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = "",
}) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div
      className={`language-selector ${className} flex items-center space-x-2`}
    >
      <span className="text-sm font-medium">{t("common.language")}</span>
      <div className="flex rounded-md overflow-hidden">
        <button
          className={`px-3 py-1 text-sm ${
            language === "en"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
          onClick={() => handleLanguageChange("en")}
          aria-label={t("accessibility.switchToEnglish")}
          aria-pressed={language === "en"}
        >
          EN
        </button>
        <button
          className={`px-3 py-1 text-sm ${
            language === "ja"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
          onClick={() => handleLanguageChange("ja")}
          aria-label={t("accessibility.switchToJapanese")}
          aria-pressed={language === "ja"}
        >
          日本語
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
