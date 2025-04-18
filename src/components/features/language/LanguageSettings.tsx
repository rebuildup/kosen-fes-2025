// src/components/features/language/LanguageSettings.tsx
import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";

interface LanguageSettingsProps {
  className?: string;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  className = "",
}) => {
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  return (
    <div className={`language-settings ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{t("settings.language")}</h3>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <span className="text-gray-700 dark:text-gray-300">
            {t("settings.selectLanguage")}
          </span>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-md ${
                  language === lang.code
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
