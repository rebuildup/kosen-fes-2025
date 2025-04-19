import { ReactNode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { SearchProvider } from "./context/SearchContext";
import { TagProvider } from "./context/TagContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BookmarkProvider>
          <SearchProvider>
            <TagProvider>{children}</TagProvider>
          </SearchProvider>
        </BookmarkProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
