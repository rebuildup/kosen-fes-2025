import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Item } from "../types/common";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";

interface TagContextType {
  tags: string[];
  popularTags: string[];
  selectedTags: string[];
  tagCounts: Record<string, number>;
  toggleTag: (tag: string) => void;
  selectTag: (tag: string) => void;
  clearTags: () => void;
  isTagSelected: (tag: string) => boolean;
  filterItemsByTags: (items: Item[]) => Item[];
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Initialize tags from all items
  useEffect(() => {
    // Combine all items
    const allItems: Item[] = [...events, ...exhibits, ...stalls];

    // Extract all tags and count occurrences
    const tagFrequency: Record<string, number> = {};
    const allTags: string[] = [];

    allItems.forEach((item) => {
      item.tags.forEach((tag) => {
        if (!tagFrequency[tag]) {
          tagFrequency[tag] = 0;
          allTags.push(tag);
        }
        tagFrequency[tag]++;
      });
    });

    // Sort tags alphabetically
    allTags.sort();

    // Get popular tags (top 10 by frequency)
    const popular = [...allTags]
      .sort((a, b) => tagFrequency[b] - tagFrequency[a])
      .slice(0, 10);

    setTags(allTags);
    setTagCounts(tagFrequency);
    setPopularTags(popular);
  }, []);

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
  const filterItemsByTags = (items: Item[]): Item[] => {
    if (selectedTags.length === 0) return items;

    return items.filter((item) =>
      selectedTags.some((tag) => item.tags.includes(tag))
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
