import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Language,
  Translations,
  getTranslationsForLanguage,
  getTranslationValue,
} from "../utils/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  t: (key: string) => string;
}

const defaultContext: LanguageContextType = {
  language: "ja", // Default to Japanese
  setLanguage: () => {},
  translations: {},
  t: (key) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Get initial language from localStorage or browser settings
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ja")) {
      return savedLanguage;
    }

    // Try to detect browser language
    const browserLang = navigator.language.substring(0, 2);
    return browserLang === "ja" ? "ja" : "en";
  });

  // Get translations for the current language
  const translations = getTranslationsForLanguage(language);

  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem("language", newLanguage);
    setLanguageState(newLanguage);
    document.documentElement.setAttribute("lang", newLanguage);
  };

  // Set the initial language attribute on the document
  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, []);

  // Translation function
  const t = (key: string): string => {
    return getTranslationValue(translations, key) || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
