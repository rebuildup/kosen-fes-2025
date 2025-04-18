import React, { useMemo } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import Tag from "../../common/Tag";

interface TagCloudProps {
  tags: string[];
  maxTags?: number;
  onTagClick?: (tag: string) => void;
  className?: string;
  filterPath?: string;
}

const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  maxTags = 30,
  onTagClick,
  className = "",
  filterPath,
}) => {
  const { t } = useLanguage();

  // Count occurrences of each tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });

    return counts;
  }, [tags]);

  // Get unique tags
  const uniqueTags = useMemo(() => {
    return Object.keys(tagCounts).sort();
  }, [tagCounts]);

  // Determine tag sizes based on frequency
  const getTagSize = (tag: string): "small" | "medium" | "large" => {
    const count = tagCounts[tag];
    const max = Math.max(...Object.values(tagCounts));

    // Normalize to 0-1 range
    const normalized = count / max;

    if (normalized < 0.33) return "small";
    if (normalized < 0.66) return "medium";
    return "large";
  };

  // Skip rendering if there are no tags
  if (!uniqueTags.length) {
    return null;
  }

  return (
    <div className={`tag-cloud ${className}`}>
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("tags.popularTags")}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {uniqueTags.slice(0, maxTags).map((tag) => (
          <Tag
            key={tag}
            label={tag}
            size={getTagSize(tag)}
            clickable={!!onTagClick || !!filterPath}
            onTagClick={onTagClick}
            filterPath={filterPath}
          />
        ))}
      </div>
    </div>
  );
};

export default TagCloud;
