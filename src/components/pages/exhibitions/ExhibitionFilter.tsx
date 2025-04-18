import React, { useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import TagList from "../../common/TagList";

interface ExhibitionFilterProps {
  tags: string[];
  activeTag: string;
  onTagClick: (tag: string) => void;
  className?: string;
}

const ExhibitionFilter: React.FC<ExhibitionFilterProps> = ({
  tags,
  activeTag,
  onTagClick,
  className = "",
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Display a limited number of tags initially, all if expanded
  const visibleTags = isExpanded ? tags : tags.slice(0, 10);
  const hasMoreTags = tags.length > 10;

  return (
    <div className={`exhibition-filter ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("exhibitions.filterByTag")}
        </h3>

        {hasMoreTags && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {isExpanded ? t("common.showLess") : t("common.showMore")}
          </button>
        )}
      </div>

      <TagList
        tags={visibleTags}
        activeTags={activeTag ? [activeTag] : []}
        clickable
        onTagClick={onTagClick}
        showAllOption
      />
    </div>
  );
};

export default ExhibitionFilter;
