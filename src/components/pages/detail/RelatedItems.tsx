import React from "react";
import { Link } from "react-router-dom";
import { SearchResult } from "../../../types/common";
import Card from "../../common/Card";

interface RelatedItemsProps {
  items: SearchResult[];
  className?: string;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({
  items,
  className = "",
}) => {
  // Get link path for each item based on its type
  const getLinkPath = (item: SearchResult) => {
    switch (item.type) {
      case "event":
        return `/events/${item.id}`;
      case "exhibition":
        return `/exhibitions/${item.id}`;
      case "foodStall":
        return `/food-stalls/${item.id}`;
      default:
        return "#";
    }
  };

  return (
    <div className={`related-items ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            showBookmarkButton
            linkTo={getLinkPath(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedItems;
