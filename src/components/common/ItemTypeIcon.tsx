import { ItemType } from "../../types/common";

interface ItemTypeIconProps {
  type: ItemType;
  size?: "small" | "medium" | "large";
  className?: string;
}

const ItemTypeIcon = ({
  type,
  size = "medium",
  className = "",
}: ItemTypeIconProps) => {
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "event":
        return "🎭";
      case "exhibit":
        return "🖼️";
      case "stall":
        return "🍽️";
      default:
        return "📌";
    }
  };

  // Get size class
  const sizeClass = `item-type-icon-${size}`;

  return (
    <span
      className={`item-type-icon ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      {getIcon()}
    </span>
  );
};

export default ItemTypeIcon;
