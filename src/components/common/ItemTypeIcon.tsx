import { ItemType } from "../../types/common";

interface ItemTypeIconProps {
  type: ItemType;
  size?: "small" | "medium" | "large";
}

const ItemTypeIcon = ({ type, size = "medium" }: ItemTypeIconProps) => {
  const getIcon = () => {
    switch (type) {
      case "event":
        return "🎭"; // Event icon
      case "exhibit":
        return "🖼️"; // Exhibit icon
      case "stall":
        return "🍽️"; // Stall icon
      default:
        return "📌"; // Default icon
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "type-icon-small";
      case "large":
        return "type-icon-large";
      default:
        return "type-icon-medium";
    }
  };

  return (
    <span className={`item-type-icon ${getSizeClass()}`} aria-hidden="true">
      {getIcon()}
    </span>
  );
};

export default ItemTypeIcon;
