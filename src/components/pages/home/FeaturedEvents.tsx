import React from "react";
import { SearchResult } from "../../../types/common";
import { useLanguage } from "../../../hooks/useLanguage";
import Card from "../../common/Card";

interface FeaturedEventsProps {
  items: SearchResult[];
  className?: string;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  items,
  className = "",
}) => {
  const { t } = useLanguage();

  // If no featured items, show a placeholder
  if (!items.length) {
    return (
      <div className={`featured-events-empty ${className} py-8 text-center`}>
        <p className="text-gray-600 dark:text-gray-400">
          {t("home.noFeaturedEvents")}
        </p>
      </div>
    );
  }

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
    <div className={`featured-events ${className}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {items.slice(0, 3).map((item) => (
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

      {items.length > 3 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {items.slice(3, 6).map((item) => (
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
      )}
    </div>
  );
};

export default FeaturedEvents;
