import React, { useState } from "react";
import { SearchResult } from "../../types/common";
import { useLanguage } from "../../hooks/useLanguage";
import Card from "./Card";
import CardSkeleton from "./CardSkeleton";

interface CardListProps {
  items: SearchResult[];
  isLoading?: boolean;
  emptyMessage?: string;
  getLinkPath: (item: SearchResult) => string;
  showBookmarkButton?: boolean;
  onCardClick?: (item: SearchResult) => void;
  columnsConfig?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

const CardList: React.FC<CardListProps> = ({
  items,
  isLoading = false,
  emptyMessage,
  getLinkPath,
  showBookmarkButton = false,
  onCardClick,
  columnsConfig = { sm: 1, md: 2, lg: 3 },
  className = "",
}) => {
  const { t } = useLanguage();

  // Generate grid columns CSS classes
  const columnsClass = `grid-cols-${columnsConfig.sm} sm:grid-cols-${
    columnsConfig.md || columnsConfig.sm
  } lg:grid-cols-${columnsConfig.lg || columnsConfig.md || columnsConfig.sm}`;

  // Show loading state
  if (isLoading) {
    return (
      <div className={`card-list ${className}`}>
        <div className={`grid ${columnsClass} gap-4 md:gap-6`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state
  if (!items.length) {
    return (
      <div className={`card-list-empty ${className} py-8 text-center`}>
        <p className="text-gray-600 dark:text-gray-400">
          {emptyMessage || t("common.noItems")}
        </p>
      </div>
    );
  }

  return (
    <div className={`card-list ${className}`}>
      <div className={`grid ${columnsClass} gap-4 md:gap-6`}>
        {items.map((item) => (
          <Card
            key={`${item.type}-${item.id}`}
            title={item.title}
            image={item.image}
            description={item.description}
            tags={item.tags}
            date={item.date}
            location={item.location}
            item={item}
            showBookmarkButton={showBookmarkButton}
            linkTo={getLinkPath(item)}
            onClick={() => onCardClick && onCardClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default CardList;
