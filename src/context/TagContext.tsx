import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "./DataContext";

interface TagContextType {
  tags: string[];
  popularTags: string[];
  selectedTags: string[];
  tagCounts: Record<string, number>;
  toggleTag: (tag: string) => void;
  selectTag: (tag: string) => void;
  clearTags: () => void;
  isTagSelected: (tag: string) => boolean;
  filterItemsByTags: (items: any[]) => any[];
}

const TagContext = createContext<TagContextType>({
  tags: [],
  popularTags: [],
  selectedTags: [],
  tagCounts: {},
  toggleTag: () => {},
  selectTag: () => {},
  clearTags: () => {},
  isTagSelected: () => false,
  filterItemsByTags: (items) => items,
});

export const useTag = () => useContext(TagContext);

interface TagProviderProps {
  children: ReactNode;
}

export const TagProvider = ({ children }: TagProviderProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Get tag data from DataContext
  const { getAllTags, getPopularTags, getTagCounts } = useData();

  const allTags = getAllTags();
  const tagCounts = getTagCounts();
  const popularTags = getPopularTags(10);

  // Sort all tags by popularity (count), then alphabetically
  const tags = [...allTags].sort((a, b) => {
    const countA = tagCounts[a] || 0;
    const countB = tagCounts[b] || 0;

    // Sort by count first (descending), then alphabetically
    if (countA !== countB) {
      return countB - countA;
    }
    return a.localeCompare(b);
  });

  // Extract tag from URL when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get("tag");

    if (
      tagParam &&
      tags.includes(tagParam) &&
      !selectedTags.includes(tagParam)
    ) {
      setSelectedTags([tagParam]);
    }
  }, [location.search, tags]);

  // Toggle a tag (add if not selected, remove if selected)
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Select a single tag (replace current selection)
  const selectTag = (tag: string) => {
    setSelectedTags([tag]);

    // Update URL with tag parameter
    const params = new URLSearchParams(location.search);
    params.set("tag", tag);

    // Navigate to search page if not already there
    if (location.pathname !== "/search") {
      navigate(`/search?${params.toString()}`);
    } else {
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };

  // Clear all selected tags
  const clearTags = () => {
    setSelectedTags([]);

    // Remove tag parameter from URL
    const params = new URLSearchParams(location.search);
    params.delete("tag");

    navigate(
      `${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  // Check if a tag is currently selected
  const isTagSelected = (tag: string) => {
    return selectedTags.includes(tag);
  };

  // Filter items by selected tags
  const filterItemsByTags = (items: any[]): any[] => {
    if (selectedTags.length === 0) return items;
    return items.filter((item) =>
      selectedTags.every((tag) => item.tags?.includes(tag))
    );
  };

  return (
    <TagContext.Provider
      value={{
        tags,
        popularTags,
        selectedTags,
        tagCounts,
        toggleTag,
        selectTag,
        clearTags,
        isTagSelected,
        filterItemsByTags,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};
