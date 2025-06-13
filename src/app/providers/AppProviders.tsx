import { ReactNode } from "react";
import { ThemeProvider } from "../../context/ThemeContext";
import { LanguageProvider } from "../../context/LanguageContext";
import { DataProvider } from "../../context/DataContext";
import { SearchProvider } from "../../context/SearchContext";
import { BookmarkProvider } from "../../context/BookmarkContext";
import { TagProvider } from "../../context/TagContext";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Centralized provider configuration for the entire application
 * Provides global context for theme, language, data management, search, bookmarks, and tags
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <DataProvider>
      <ThemeProvider>
        <LanguageProvider>
          <SearchProvider>
            <BookmarkProvider>
              <TagProvider>
                {children}
              </TagProvider>
            </BookmarkProvider>
          </SearchProvider>
        </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
};