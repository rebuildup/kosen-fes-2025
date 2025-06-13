// src/AppProviders.tsx
import { ReactNode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { DataProvider } from "./context/DataContext";
import { BookmarkProvider } from "./context/BookmarkContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <DataProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BookmarkProvider>{children}</BookmarkProvider>
        </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
};
