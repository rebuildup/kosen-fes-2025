import { ItemType } from "../../types/common";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { MapIcon } from "../icons/MapIcon";
import { SponsorIcon } from "../icons/SponsorIcon";

interface ItemTypeIconProps {
  type: ItemType;
  size?: "small" | "medium" | "large";
}

const ItemTypeIcon = ({ type, size = "medium" }: ItemTypeIconProps) => {
  // Get size in pixels
  const getSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 24;
      case "medium":
      default:
        return 20;
    }
  };

  // Get icon based on type
  const renderIcon = () => {
    switch (type) {
      case "event":
        return <EventIcon size={getSize()} />;
      case "exhibit":
        return <ExhibitIcon size={getSize()} />;
      case "stall":
        return <MapIcon size={getSize()} />;
      case "sponsor":
        return <SponsorIcon size={getSize()} />;
      default:
        return <MapIcon size={getSize()} />;
    }
  };

  return <span aria-hidden="true">{renderIcon()}</span>;
};

export default ItemTypeIcon;
