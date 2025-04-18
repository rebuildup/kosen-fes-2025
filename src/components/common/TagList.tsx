import React from "react";
import Tag from "./Tag";
import { useLanguage } from "../../hooks/useLanguage";

interface TagListProps {
  tags: string[];
  activeTags?: string[];
  clickable?: boolean;
  onTagClick?: (tag: string) => void;
  filterPath?: string;
  className?: string;
  showAllOption?: boolean;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  activeTags = [],
  clickable = false,
  onTagClick,
  filterPath,
  className = "",
  showAllOption = false,
}) => {
  const { t } = useLanguage();

  // Get unique tags and sort them alphabetically
  const uniqueTags = [...new Set(tags)].sort();

  // Check if any tags are active
  const hasActiveTags = activeTags.length > 0;

  return (
    <div className={`tag-list flex flex-wrap gap-2 ${className}`}>
      {showAllOption && (
        <Tag
          label={t("tags.all")}
          clickable={clickable}
          active={!hasActiveTags}
          onTagClick={() => onTagClick && onTagClick("")}
          filterPath={filterPath}
        />
      )}

      {uniqueTags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          clickable={clickable}
          active={activeTags.includes(tag)}
          onTagClick={onTagClick}
          filterPath={filterPath}
        />
      ))}
    </div>
  );
};

export default TagList;
