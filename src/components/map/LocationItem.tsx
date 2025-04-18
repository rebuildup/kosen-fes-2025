import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Item } from "../../types/common";
import ItemTypeIcon from "../common/ItemTypeIcon";

interface LocationItemProps {
  location: string;
  items: Item[];
  isHovered: boolean;
  isSelected: boolean;
  onHover: (location: string | null) => void;
  onSelect: (location: string | null) => void;
}

const LocationItem = ({
  location,
  items,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}: LocationItemProps) => {
  const { t } = useLanguage();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Group items by type
  const eventItems = items.filter((item) => item.type === "event");
  const exhibitItems = items.filter((item) => item.type === "exhibit");
  const stallItems = items.filter((item) => item.type === "stall");

  // Handle item hover
  const handleItemHover = (itemId: string | null) => {
    setExpandedItem(itemId);
  };

  return (
    <div
      className={`location-item ${isHovered ? "hovered" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onMouseEnter={() => onHover(location)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(location)}
    >
      <div className="location-item-header">
        <h3 className="location-item-title">{location}</h3>
        <div className="location-item-count">
          {items.length} {items.length === 1 ? t("map.item") : t("map.items")}
        </div>
      </div>

      {(isHovered || isSelected) && (
        <div className="location-item-content">
          {eventItems.length > 0 && (
            <div className="location-item-section">
              <h4 className="location-item-section-title">
                <ItemTypeIcon type="event" size="small" />
                <span>{t("detail.event")}</span>
              </h4>
              <ul className="location-item-list">
                {eventItems.map((item) => (
                  <li
                    key={item.id}
                    className={`location-item-list-item ${
                      expandedItem === item.id ? "expanded" : ""
                    }`}
                    onMouseEnter={() => handleItemHover(item.id)}
                    onMouseLeave={() => handleItemHover(null)}
                  >
                    <Link
                      to={`/detail/${item.type}/${item.id}`}
                      className="location-item-link"
                    >
                      <span className="location-item-name">{item.title}</span>
                      <span className="location-item-time">{item.time}</span>
                    </Link>

                    {expandedItem === item.id && (
                      <div className="location-item-expanded">
                        {item.imageUrl && (
                          <div className="location-item-image">
                            <img src={item.imageUrl} alt={item.title} />
                          </div>
                        )}
                        <p className="location-item-description">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exhibitItems.length > 0 && (
            <div className="location-item-section">
              <h4 className="location-item-section-title">
                <ItemTypeIcon type="exhibit" size="small" />
                <span>{t("detail.exhibit")}</span>
              </h4>
              <ul className="location-item-list">
                {exhibitItems.map((item) => (
                  <li
                    key={item.id}
                    className={`location-item-list-item ${
                      expandedItem === item.id ? "expanded" : ""
                    }`}
                    onMouseEnter={() => handleItemHover(item.id)}
                    onMouseLeave={() => handleItemHover(null)}
                  >
                    <Link
                      to={`/detail/${item.type}/${item.id}`}
                      className="location-item-link"
                    >
                      <span className="location-item-name">{item.title}</span>
                      <span className="location-item-time">{item.time}</span>
                    </Link>

                    {expandedItem === item.id && (
                      <div className="location-item-expanded">
                        {item.imageUrl && (
                          <div className="location-item-image">
                            <img src={item.imageUrl} alt={item.title} />
                          </div>
                        )}
                        <p className="location-item-description">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stallItems.length > 0 && (
            <div className="location-item-section">
              <h4 className="location-item-section-title">
                <ItemTypeIcon type="stall" size="small" />
                <span>{t("detail.stall")}</span>
              </h4>
              <ul className="location-item-list">
                {stallItems.map((item) => (
                  <li
                    key={item.id}
                    className={`location-item-list-item ${
                      expandedItem === item.id ? "expanded" : ""
                    }`}
                    onMouseEnter={() => handleItemHover(item.id)}
                    onMouseLeave={() => handleItemHover(null)}
                  >
                    <Link
                      to={`/detail/${item.type}/${item.id}`}
                      className="location-item-link"
                    >
                      <span className="location-item-name">{item.title}</span>
                      <span className="location-item-time">{item.time}</span>
                    </Link>

                    {expandedItem === item.id && (
                      <div className="location-item-expanded">
                        {item.imageUrl && (
                          <div className="location-item-image">
                            <img src={item.imageUrl} alt={item.title} />
                          </div>
                        )}
                        <p className="location-item-description">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationItem;
