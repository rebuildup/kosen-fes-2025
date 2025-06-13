import { ReactNode } from "react";
import { ThemeProvider } from "../../context/ThemeContext";
import { LanguageProvider } from "../../context/LanguageContext";
import { DataProvider } from "../../context/DataContext";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Centralized provider configuration for the entire application
 * Provides global context for theme, language, and data management
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <DataProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
};