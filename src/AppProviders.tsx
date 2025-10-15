// src/AppProviders.tsx
import type { ReactNode } from "react";

import { BookmarkProvider } from "./context/BookmarkContext";
import { DataProvider } from "./context/DataContext";
import { LanguageProvider } from "./context/LanguageContext";
import { SearchProvider } from "./context/SearchContext";
import { TagProvider } from "./context/TagContext";
import { ThemeProvider } from "./context/ThemeContext";

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
