// src/components/features/LocationCard/LocationCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Location } from "../../../types/location";
import styles from "./LocationCard.module.css";

interface LocationCardProps {
  location: Location;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  isActive,
  onHover,
  onLeave,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.locationCard} ${isActive ? styles.active : ""} ${
        isExpanded ? styles.expanded : ""
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleToggleExpand}
    >
      <div
        className={styles.colorIndicator}
        style={{ backgroundColor: location.color }}
      ></div>

      <div className={styles.content}>
        <h3 className={styles.title}>{location.name}</h3>
        <p className={styles.type}>{location.type}</p>

        {isExpanded && (
          <div className={styles.expandedContent}>
            <div className={styles.imageContainer}>
              <img
                src={location.image}
                alt={location.name}
                className={styles.image}
              />
            </div>

            <p className={styles.description}>{location.description}</p>

            <div className={styles.eventsTitle}>この会場のイベント:</div>

            <ul className={styles.eventsList}>
              {location.events.map((event) => (
                <li key={event.id} className={styles.eventItem}>
                  <Link
                    to={`/detail/${event.type}/${event.id}`}
                    className={styles.eventLink}
                  >
                    {event.title}
                  </Link>
                  <span className={styles.eventTime}>{event.time}</span>
                </li>
              ))}
            </ul>

            <Link
              to={`/detail/location/${location.id}`}
              className={styles.detailLink}
            >
              詳細を見る
              <svg className={styles.arrowIcon} viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
