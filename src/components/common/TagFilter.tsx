import { useState, useRef } from "react";
import { useSearch } from "../../context/SearchContext";
import { useTag } from "../../context/TagContext";
import { useLanguage } from "../../context/LanguageContext";

interface TagFilterProps {
  onFilter?: () => void;
  compact?: boolean;
}

const TagFilter = ({ onFilter, compact = false }: TagFilterProps) => {
  const { tags, tagCounts } = useTag();
  const { performSearch } = useSearch();
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Filter tags by search input
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchValue.toLowerCase())
  );

  // タグをクリックした時に検索を実行
  const handleTagClick = (tag: string) => {
    performSearch(tag);
    if (onFilter) onFilter();
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

      <div className="overflow-x-auto scrollbar-thin" ref={tagContainerRef}>
        <div className="flex gap-2 pb-2 min-w-max items-center">
          {filteredTags.length === 0 ? (
            <div className="text-sm py-4 italic text-[var(--text-secondary)] flex items-center gap-2">
              {searchValue ? t("tags.noTagsFound") : t("tags.searchByTag")}
            </div>
          ) : (
            filteredTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 text-sm rounded-full border transition-all duration-200 hover:scale-105 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gradient-to-r hover:from-[var(--accent-purple)] hover:to-[var(--accent-pink)] hover:text-white hover:border-transparent hover:shadow-md"
              >
                {tag}
                {tagCounts[tag] && (
                  <span className="ml-1 text-xs opacity-70">
                    {tagCounts[tag]}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
        <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
          <span>💡</span>
          {t("search.tagSearchHint")}
        </div>
      </div>
    </div>
  );
};

export default TagFilter;
