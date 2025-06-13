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

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <DataProvider>
      <ThemeProvider>
        <LanguageProvider>
          <SearchProvider>
            <BookmarkProvider>
              <TagProvider>{children}</TagProvider>
            </BookmarkProvider>
          </SearchProvider>
        </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
};
