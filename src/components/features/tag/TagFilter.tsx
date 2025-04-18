import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import TagList from "../../common/TagList";

interface TagFilterProps {
  tags: string[];
  activeTag: string;
  onTagClick: (tag: string) => void;
  className?: string;
  filterPath?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  activeTag,
  onTagClick,
  className = "",
  filterPath,
}) => {
  const { t } = useLanguage();

  // Skip rendering if there are no tags
  if (!tags.length) {
    return null;
  }

  return (
    <div className={`tag-filter ${className}`}>
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("tags.filterByTag")}
        </h3>
      </div>

      <TagList
        tags={tags}
        activeTags={activeTag ? [activeTag] : []}
        clickable
        onTagClick={onTagClick}
        filterPath={filterPath}
        showAllOption
      />
    </div>
  );
};

export default TagFilter;
