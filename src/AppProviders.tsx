// src/AppProviders.tsx
import { ReactNode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { DataProvider } from "./context/DataContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { TagProvider } from "./context/TagContext";
import { SearchProvider } from "./context/SearchContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <DataProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TagProvider>
            <SearchProvider>
              <BookmarkProvider>{children}</BookmarkProvider>
            </SearchProvider>
          </TagProvider>
        </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
};
