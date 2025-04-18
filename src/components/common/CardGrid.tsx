import { useMemo } from "react";
import { Item } from "../../types/common";
import Card from "./Card";
import { useLanguage } from "../../context/LanguageContext";

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
  filterType?: "event" | "exhibit" | "stall" | "all";
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

  // If no items and we have an empty message
  if (filteredItems.length === 0) {
    return (
      <div className="card-grid-empty">
        {emptyMessage || getDefaultEmptyMessage()}
      </div>
    );
  }

  return (
    <div
      className={`card-grid card-grid-${variant} ${className}`}
      style={gridStyle}
    >
      {filteredItems.map((item) => (
        <Card
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
