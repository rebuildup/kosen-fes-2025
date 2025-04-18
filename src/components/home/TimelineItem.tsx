import { Link } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import ItemTypeIcon from "../common/ItemTypeIcon";

interface TimelineItemProps {
  item: Item;
  className?: string;
}

const TimelineItem = ({ item, className = "" }: TimelineItemProps) => {
  const { t } = useLanguage();

  // Get type label
  const getTypeLabel = () => {
    if (item.type === "event") {
      return t("detail.event");
    } else if (item.type === "exhibit") {
      return t("detail.exhibit");
    } else {
      return t("detail.stall");
    }
  };

  return (
    <div className={`timeline-item ${className}`}>
      <div className="timeline-item-time">{item.time}</div>
      <div className="timeline-item-content">
        <div className="timeline-item-type">
          <ItemTypeIcon type={item.type} size="small" />
          <span className="timeline-item-type-label">{getTypeLabel()}</span>
        </div>
        <h4 className="timeline-item-title">
          <Link to={`/detail/${item.type}/${item.id}`}>{item.title}</Link>
        </h4>
        <div className="timeline-item-location">
          <span className="timeline-item-location-icon">📍</span>
          <span>{item.location}</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
