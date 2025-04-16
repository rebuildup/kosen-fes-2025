// src/components/features/TimelineEvent/TimelineEvent.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBookmark } from "../../../hooks/useBookmark";
import styles from "./TimelineEvent.module.css";

interface TimelineEventProps {
  id: string | number;
  title: string;
  time: string;
  endTime: string;
  location: string;
  category: string;
  image: string;
  type: "event" | "exhibit";
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  id,
  title,
  time,
  endTime,
  location,
  category,
  image,
  type,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmark(type, id);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark();
  };

  return (
    <div
      className={`${styles.timelineEvent} ${styles[category]} ${
        isExpanded ? styles.expanded : ""
      }`}
      onClick={handleToggleExpand}
    >
      <div className={styles.basicInfo}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.meta}>
          <span className={styles.time}>
            {time} - {endTime}
          </span>
          <span className={styles.location}>{location}</span>
        </div>

        <button
          className={`${styles.expandButton} ${
            isExpanded ? styles.expanded : ""
          }`}
          aria-label={isExpanded ? "詳細を閉じる" : "詳細を表示"}
        >
          <svg className={styles.expandIcon} viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.image} />
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.bookmarkButton} ${
                isBookmarked ? styles.bookmarked : ""
              }`}
              onClick={handleBookmarkClick}
              aria-label={
                isBookmarked ? "ブックマークから削除" : "ブックマークに追加"
              }
            >
              <svg className={styles.actionIcon} viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <span>{isBookmarked ? "保存済み" : "保存する"}</span>
            </button>

            <Link
              to={`/detail/${type}/${id}`}
              className={styles.detailsLink}
              onClick={(e) => e.stopPropagation()}
            >
              <svg className={styles.actionIcon} viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
              </svg>
              <span>詳細を見る</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineEvent;
