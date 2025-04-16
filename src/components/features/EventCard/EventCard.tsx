// src/components/features/EventCard/EventCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import styles from "./EventCard.module.css";

interface EventCardProps {
  id: string | number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
  type: "event" | "exhibit";
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  image,
  date,
  time,
  location,
  category,
  type,
  compact = false,
}) => {
  const formattedDate = format(new Date(date), "MM月dd日(EEE)", { locale: ja });

  return (
    <Link
      to={`/detail/${type}/${id}`}
      className={`${styles.card} ${compact ? styles.compact : ""}`}
    >
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
        <span className={`${styles.category} ${styles[category]}`}>
          {category}
        </span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.details}>
          <div className={styles.detail}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
            </svg>
            {formattedDate}
          </div>

          <div className={styles.detail}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            {time}
          </div>

          <div className={styles.detail}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {location}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
