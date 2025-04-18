import { ReactNode } from "react";
import { Item } from "../../types/common";
import Card from "./Card";

interface CardGridProps {
  items: Item[];
  variant?: "default" | "compact" | "featured";
  showTags?: boolean;
  showDescription?: boolean;
  emptyMessage?: ReactNode;
  onCardClick?: (item: Item) => void;
  highlightText?: (text: string) => React.ReactNode;
}

const CardGrid = ({
  items,
  variant = "default",
  showTags = false,
  showDescription = false,
  emptyMessage,
  onCardClick,
  highlightText,
}: CardGridProps) => {
  if (items.length === 0 && emptyMessage) {
    return <div className="card-grid-empty">{emptyMessage}</div>;
  }

  return (
    <div className={`card-grid card-grid-${variant}`}>
      {items.map((item) => (
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
