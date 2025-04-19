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
    <div className={`tag-filter ${compact ? "tag-filter-compact" : ""}`}>
      <div className="tag-filter-header">
        <h3 className="tag-filter-title">{t("tags.filterByTag")}</h3>

        {selectedTags.length > 0 && (
          <button className="tag-filter-clear" onClick={handleClearTags}>
            {t("tags.clearFilters")}
          </button>
        )}
      </div>

      {!compact && (
        <div className="tag-filter-search">
          <input
            type="text"
            placeholder={t("tags.searchTags")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="tag-filter-input"
          />
        </div>
      )}

      <div className="tag-filter-scroll-container" ref={tagContainerRef}>
        <div className="tag-filter-tags">
          {filteredTags.length === 0 ? (
            <div className="tag-filter-empty">{t("tags.noTagsFound")}</div>
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
