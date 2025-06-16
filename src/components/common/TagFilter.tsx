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
      className={`mb-6 border rounded-lg transition-colors ${
        compact ? "p-3" : "p-4"
      }`}
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderColor: "var(--color-border-primary)",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3
          className="text-sm font-medium m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("tags.filterByTag")}
        </h3>

        {selectedTags.length > 0 && (
          <button
            className="text-xs font-medium bg-none border-none cursor-pointer transition-colors hover:underline"
            style={{ color: "var(--color-accent)" }}
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
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-opacity-50 transition-colors"
            style={
              {
                backgroundColor: "var(--color-bg-secondary)",
                borderColor: "var(--color-border-primary)",
                color: "var(--color-text-primary)",
                "--tw-ring-color": "var(--color-accent)",
              } as React.CSSProperties
            }
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-primary)";
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto" ref={tagContainerRef}>
        <div className="flex gap-2 pb-2 min-w-max">
          {filteredTags.length === 0 ? (
            <div
              className="text-sm py-2 italic"
              style={{ color: "var(--color-text-secondary)" }}
            >
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
