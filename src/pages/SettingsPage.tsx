import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import ThemeSettings from "../components/settings/ThemeSettings";
import LanguageSettings from "../components/settings/LanguageSettings";

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="settings-page py-6 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>

        <div className="bg-background-card rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {/* Theme Settings */}
            <div className="mb-8">
              <ThemeSettings />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

            {/* Language Settings */}
            <div className="mb-8">
              <LanguageSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
