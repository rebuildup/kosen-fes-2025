import { useState, useRef, useEffect } from "react";
import { useTag } from "../../context/TagContext";
import { useLanguage } from "../../context/LanguageContext";
import Tag from "./Tag";

interface TagFilterProps {
  onFilter?: () => void;
  compact?: boolean;
}

const TagFilter = ({ onFilter, compact = false }: TagFilterProps) => {
  const { tags, selectedTags, toggleTag, clearTags, tagCounts } = useTag();
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Filter tags by search input
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleToggleTag = (tag: string) => {
    toggleTag(tag);
    if (onFilter) onFilter();
  };

  const handleClearTags = () => {
    clearTags();
    if (onFilter) onFilter();
  };

  // Scroll selected tags into view when tags are selected
  useEffect(() => {
    if (tagContainerRef.current && selectedTags.length > 0) {
      // Find the first selected tag element
      const selectedTag = tagContainerRef.current.querySelector(".tag-active");
      if (selectedTag) {
        selectedTag.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedTags]);

  return (
    <div className={`mb-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 transition-colors ${compact ? "p-3" : "p-4"}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 m-0">
          {t("tags.filterByTag")}
        </h3>

        {selectedTags.length > 0 && (
          <button 
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline bg-none border-none cursor-pointer transition-colors" 
            onClick={handleClearTags}
          >
            {t("tags.clearFilters")}
          </button>
        )}
      </div>

      {!compact && (
        <div className="mb-3">
          <input
            type="text"
            placeholder={t("tags.searchTags")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      )}

      <div className="overflow-x-auto" ref={tagContainerRef}>
        <div className="flex gap-2 pb-2 min-w-max">
          {filteredTags.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 py-2 italic">
              {t("tags.noTagsFound")}
            </div>
          ) : (
            filteredTags.map((tag) => (
              <Tag
                key={tag}
                tag={tag}
                count={tagCounts[tag]}
                onClick={handleToggleTag}
                size="small"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TagFilter;
