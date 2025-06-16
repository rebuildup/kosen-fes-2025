import { useMemo } from "react";
import { Item } from "../../types/common";
import UnifiedCard from "../../shared/components/ui/UnifiedCard";
import { useLanguage } from "../../context/LanguageContext";

// Update the filterType prop type
interface CardGridProps {
  items: Item[];
  variant?: "default" | "compact" | "grid" | "list";
  showTags?: boolean;
  showDescription?: boolean;
  emptyMessage?: React.ReactNode;
  onCardClick?: (item: Item) => void;
  highlightText?: (text: string) => React.ReactNode;
  className?: string;
  columns?: number;
  filterType?: "event" | "exhibit" | "stall" | "sponsor" | "all"; // Add "sponsor" here
}

const CardGrid = ({
  items,
  variant = "default",
  showTags = false,
  showDescription = false,
  emptyMessage,
  onCardClick,
  highlightText,
  className = "",
  columns,
  filterType = "all",
}: CardGridProps) => {
  const { t } = useLanguage();

  // Filter items by type if specified
  const filteredItems = useMemo(() => {
    if (filterType === "all") return items;
    return items.filter((item) => item.type === filterType);
  }, [items, filterType]);

  // Get default empty message based on filter type
  const getDefaultEmptyMessage = () => {
    switch (filterType) {
      case "event":
        return t("events.noEvents");
      case "exhibit":
        return t("exhibits.noExhibits");
      case "stall":
        return t("exhibits.noStalls");
      default:
        return t("common.noItems");
    }
  };

  // Generate grid style based on columns prop
  const gridStyle = columns
    ? {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }
    : undefined;

  // Get grid classes based on variant
  const getGridClasses = () => {
    switch (variant) {
      case "compact":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
      case "list":
        return "space-y-4";
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
    }
  };

  // If no items and we have an empty message
  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1" />
          </svg>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {emptyMessage || getDefaultEmptyMessage()}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${getGridClasses()} ${className}`}
      style={gridStyle}
    >
      {filteredItems.map((item) => (
        <UnifiedCard
          key={item.id}
          item={item}
          variant={variant}
          showTags={showTags}
          showDescription={showDescription}
          highlightText={highlightText}
          onClick={onCardClick ? () => onCardClick(item) : undefined}
        />
      ))}
    </div>
  );
};

export default CardGrid;
