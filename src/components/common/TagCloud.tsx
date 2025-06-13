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
    return null;
  }

  return (
    <div className="mb-5">
      {title && (
        <h3 className="text-base font-medium mb-3 text-gray-900 dark:text-gray-100">
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
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline bg-none border-none cursor-pointer px-2 py-1 transition-colors">
              {t("tags.showMore")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
