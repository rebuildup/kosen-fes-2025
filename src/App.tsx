import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { SearchProvider } from "./context/SearchContext";
import { TagProvider } from "./context/TagContext";
import routes from "./routes";

function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BookmarkProvider>
          <SearchProvider>
            <TagProvider>{routing}</TagProvider>
          </SearchProvider>
        </BookmarkProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
