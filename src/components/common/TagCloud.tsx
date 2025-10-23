import { useLanguage } from "../../context/LanguageContext";
import { useTag } from "../../context/TagContext";
import Tag from "./Tag";

interface TagCloudProps {
  tags?: string[];
  showCount?: boolean;
  maxTags?: number;
  title?: string;
  size?: "small" | "medium" | "large";
  onTagClick?: (tag: string) => void;
}

const TagCloud = ({
  maxTags,
  onTagClick,
  showCount = false,
  size = "medium",
  tags,
  title,
}: TagCloudProps) => {
  const { popularTags, tagCounts } = useTag();
  const { t } = useLanguage();

  // Use provided tags or fall back to popular tags
  const displayTags = tags || popularTags;

  // Limit number of tags if maxTags is specified
  const limitedTags = maxTags ? displayTags.slice(0, maxTags) : displayTags;

  if (limitedTags.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-[var(--text-secondary)]">タグがありません</p>
      </div>
    );
  }

  return (
    <div className="mb-5">
      {title && (
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
      )}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 pb-2">
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
            <button
              type="button"
              className="rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--primary-color)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)]"
            >
              {t("tags.showMore")} ({displayTags.length - maxTags}+)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
