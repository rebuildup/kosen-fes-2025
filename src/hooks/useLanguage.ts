// src/hooks/useLanguage.ts
import { useContext } from "react";
import LanguageContext from "../components/features/language/LanguageContext";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default useLanguage;
