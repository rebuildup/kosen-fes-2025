import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Language } from "../../../types/common";

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLanguages: { code: Language; name: string }[];
  isJapanese: boolean;
}

// Available languages
const availableLanguages = [
  { code: "en" as Language, name: "English" },
  { code: "ja" as Language, name: "日本語" },
];

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages,
  isJapanese: false,
});

// Custom hook for using language
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  // Initialize translations
  const [translations, setTranslations] = useState<
    Record<Language, TranslationDictionary>
  >({
    en: {},
    ja: {},
  });

  // Initialize language from localStorage or browser language or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "en" || savedLanguage === "ja") {
      return savedLanguage;
    }

    // Try to detect browser language
    const browserLanguage = navigator.language.split("-")[0].toLowerCase();
    return browserLanguage === "ja" ? "ja" : "en";
  });

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Load English translations
        const enTranslationsModule = await import("../../../locales/en.json");

        // Load Japanese translations
        const jaTranslationsModule = await import("../../../locales/ja.json");

        setTranslations({
          en: enTranslationsModule.default,
          ja: jaTranslationsModule.default,
        });
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };

    loadTranslations();
  }, []);

  // Update localStorage and document language when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("lang", language);

    // Add language class to document for CSS targeting
    document.documentElement.classList.remove("lang-en", "lang-ja");
    document.documentElement.classList.add(`lang-${language}`);
  }, [language]);

  // Set language
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  // Translation function with parameter substitution
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    // Navigate through the nested keys
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to the key if translation is not found
        return key;
      }
    }

    // If the value is not a string, return the key
    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce(
        (result, [param, replacement]) =>
          result.replace(new RegExp(`{{${param}}}`, "g"), replacement),
        value
      );
    }

    return value;
  };

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages,
    isJapanese: language === "ja",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
