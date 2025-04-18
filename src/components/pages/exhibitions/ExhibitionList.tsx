import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { SearchResult } from "../../../types/common";
import CardList from "../../common/CardList";

interface ExhibitionListProps {
  items: SearchResult[];
  isLoading?: boolean;
  className?: string;
}

const ExhibitionList: React.FC<ExhibitionListProps> = ({
  items,
  isLoading = false,
  className = "",
}) => {
  const { t } = useLanguage();

  // Get link path for details
  const getLinkPath = (item: SearchResult) => {
    if (item.type === "exhibition") {
      return `/exhibitions/${item.id}`;
    } else {
      return `/food-stalls/${item.id}`;
    }
  };

  return (
    <div className={`exhibition-list ${className}`}>
      <CardList
        items={items}
        isLoading={isLoading}
        emptyMessage={t("exhibitions.noItems")}
        getLinkPath={getLinkPath}
        showBookmarkButton
      />
    </div>
  );
};

export default ExhibitionList;
