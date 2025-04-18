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
    <div className="tag-cloud">
      {title && <h3 className="tag-cloud-title">{title}</h3>}
      <div className="tag-cloud-content">
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
          <button className="tag-cloud-more">{t("tags.showMore")}</button>
        )}
      </div>
    </div>
  );
};

export default TagCloud;
