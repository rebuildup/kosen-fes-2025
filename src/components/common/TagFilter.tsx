import { useRef, useState } from "react";

import { useLanguage } from "../../context/LanguageContext";
import { useTag } from "../../context/TagContext";
import Tag from "./Tag";

interface TagFilterProps {
  onFilter?: (tag: string) => void;
  compact?: boolean;
}

const TagFilter = ({ compact = false, onFilter }: TagFilterProps) => {
  const { isTagSelected, tagCounts, tags, toggleTag } = useTag();
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Filter tags by search input
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchValue.toLowerCase()),
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
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
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
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-sm placeholder-[var(--text-secondary)] transition-all duration-200 focus:outline-none"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
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

      <div className="scrollbar-thin overflow-x-auto" ref={tagContainerRef}>
        <div className="flex min-w-max items-center gap-2 pb-2">
          {filteredTags.length === 0 ? (
            <div className="flex items-center gap-2 py-4 text-sm text-[var(--text-secondary)] italic">
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
