import React, { createContext, useContext, ReactNode } from "react";
import { ThemeProvider } from "../components/features/theme/ThemeContext";
import { LanguageProvider } from "../components/features/language/LanguageContext";
import { SearchProvider } from "../components/features/search/SearchContext";
import { BookmarkProvider } from "../components/features/bookmark/BookmarkContext";

interface AppProviderProps {
  children: ReactNode;
}

// Empty context since we're just wrapping providers
const AppContext = createContext<{}>({});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AppContext.Provider value={{}}>
      <ThemeProvider>
        <LanguageProvider>
          <SearchProvider>
            <BookmarkProvider>{children}</BookmarkProvider>
          </SearchProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default AppContext;
