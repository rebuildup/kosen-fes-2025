import { useState, useRef } from "react";
import Tag from "./Tag";
import { useTag } from "../../context/TagContext";
import { useLanguage } from "../../context/LanguageContext";

interface TagFilterProps {
  onFilter?: (tag: string) => void;
  compact?: boolean;
}

const TagFilter = ({ onFilter, compact = false }: TagFilterProps) => {
  const { tags, tagCounts, toggleTag, isTagSelected } = useTag();
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Filter tags by search input
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchValue.toLowerCase())
  );

  // タグをクリックした時に検索を実行
  const handleTagClick = (tag: string) => {
    toggleTag(tag);
    if (onFilter) {
      onFilter(tag);
    }
  };

  return (
    <div className={`${compact ? "p-3" : "p-0"}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] m-0 flex items-center gap-2">
          {t("tags.searchByTag")}
        </h3>
      </div>

      {!compact && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t("tags.searchTags")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 focus:ring-2 bg-[var(--bg-primary)] border-[var(--border-color)] placeholder-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]/20"
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

      <div className="overflow-x-auto scrollbar-thin" ref={tagContainerRef}>
        <div className="flex gap-2 pb-2 min-w-max items-center">
          {filteredTags.length === 0 ? (
            <div className="text-sm py-4 italic text-[var(--text-secondary)] flex items-center gap-2">
              {searchValue ? t("tags.noTagsFound") : t("tags.searchByTag")}
            </div>
          ) : (
            filteredTags.map((tag) => (
              <Tag
                key={tag}
                tag={tag}
                count={tagCounts[tag]}
                size={compact ? "small" : "medium"}
                onClick={handleTagClick}
                role="option"
                aria-selected={isTagSelected(tag)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TagFilter;
