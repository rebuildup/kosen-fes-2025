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
    <div
      className={`mb-6 border rounded-lg transition-all duration-200 bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-sm ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] m-0 flex items-center gap-2">
          <span>🏷️</span>
          {t("tags.filterByTag")}
        </h3>

        {selectedTags.length > 0 && (
          <button
            className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 hover:shadow-sm bg-[var(--instagram-gradient-subtle)] text-[var(--primary-color)] hover:bg-gradient-to-r hover:from-[var(--accent-purple)] hover:to-[var(--accent-pink)] hover:text-white"
            onClick={handleClearTags}
          >
            {t("tags.clearFilters")}
          </button>
        )}
      </div>

      {!compact && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t("tags.searchTags")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-50 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]/20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-4 w-4 text-[var(--text-secondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto" ref={tagContainerRef}>
        <div className="flex gap-2 pb-2 min-w-max">
          {filteredTags.length === 0 ? (
            <div className="text-sm py-4 italic text-[var(--text-secondary)] flex items-center gap-2">
              <span>🔍</span>
              {searchValue ? t("tags.noTagsFound") : t("tags.filterByTag")}
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

      {/* Show summary if tags are selected */}
      {selectedTags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <span>✨</span>
              {selectedTags.length} {t("tags.selected")}
            </span>
            <span className="text-[var(--text-tertiary)]">•</span>
            <span>{t("tags.clearFilters")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
