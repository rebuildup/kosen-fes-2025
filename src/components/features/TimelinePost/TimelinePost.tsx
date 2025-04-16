// src/components/features/TimelinePost/TimelinePost.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./TimelinePost.module.css";

interface TimelinePostProps {
  title: string;
  date: string;
  time: string;
  description: string;
  category: string;
  image: string;
  location: string;
  link: string;
}

const TimelinePost: React.FC<TimelinePostProps> = ({
  title,
  date,
  time,
  description,
  category,
  image,
  location,
  link,
}) => {
  return (
    <div className={styles.timelinePost}>
      <div className={styles.timeMarker}>
        <div className={styles.date}>{date}</div>
        <div className={styles.dot}></div>
        <div className={styles.line}></div>
      </div>

      <div className={styles.content}>
        <Link to={link} className={styles.card}>
          <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.image} />
            <span className={styles.category}>{category}</span>
          </div>

          <div className={styles.details}>
            <h3 className={styles.title}>{title}</h3>

            <div className={styles.meta}>
              <div className={styles.time}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                {time}
              </div>

              <div className={styles.location}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {location}
              </div>
            </div>

            <p className={styles.description}>{description}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TimelinePost;
