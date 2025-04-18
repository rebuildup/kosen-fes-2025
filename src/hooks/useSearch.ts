import { useContext } from "react";
import SearchContext from "../components/features/search/SearchContext";

/**
 * Custom hook for accessing search context throughout the application
 * @returns Search context values
 */
const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context;
};

export default useSearch;
