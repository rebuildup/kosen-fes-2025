import Tag from "./Tag";
import { useTag } from "../../context/TagContext";
import { useLanguage } from "../../context/LanguageContext";

interface TagCloudProps {
  tags?: string[];
  showCount?: boolean;
  maxTags?: number;
  title?: string;
  size?: "small" | "medium" | "large";
  onTagClick?: (tag: string) => void;
}

const TagCloud = ({
  tags,
  showCount = false,
  maxTags,
  title,
  size = "medium",
  onTagClick,
}: TagCloudProps) => {
  const { popularTags, tagCounts } = useTag();
  const { t } = useLanguage();

  // Use provided tags or fall back to popular tags
  const displayTags = tags || popularTags;

  // Limit number of tags if maxTags is specified
  const limitedTags = maxTags ? displayTags.slice(0, maxTags) : displayTags;

  if (limitedTags.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🏷️</div>
        <p className="text-[var(--text-secondary)]">タグがありません</p>
      </div>
    );
  }

  return (
    <div className="mb-5">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
          <span>🏷️</span>
          {title}
        </h3>
      )}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {limitedTags.map((tag) => (
            <Tag
              key={tag}
              tag={tag}
              count={showCount ? tagCounts[tag] : undefined}
              size={size}
              onClick={onTagClick}
            />
          ))}

          {maxTags && displayTags.length > maxTags && (
            <button className="text-xs px-3 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200">
              {t("tags.showMore")} ({displayTags.length - maxTags}+)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
