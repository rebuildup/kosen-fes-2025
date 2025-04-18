import { useContext } from "react";
import LanguageContext from "../components/features/language/LanguageContext";

/**
 * Custom hook for accessing language context throughout the application
 * @returns Language context values (language, setLanguage, t)
 */
const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};

export default useLanguage;
