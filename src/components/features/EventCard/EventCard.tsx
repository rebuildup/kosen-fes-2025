// src/components/features/EventCard/EventCard.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { gsap } from "gsap";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useBookmarkContext } from "../../../contexts/BookmarkContext";
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
  const { language, t } = useLanguage();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked(type, id));
  const [likeCount, setLikeCount] = useState(
    Math.floor(Math.random() * 200) + 50
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const likeRef = useRef<HTMLButtonElement>(null);
  const bookmarkRef = useRef<HTMLButtonElement>(null);

  // Format date based on current language
  const formattedDate = format(
    new Date(date),
    language === "ja" ? "MM月dd日(EEE)" : "MMM d, yyyy",
    { locale: language === "ja" ? ja : enUS }
  );

  // Check if bookmarked on mount and when the bookmark context changes
  useEffect(() => {
    setBookmarked(isBookmarked(type, id));
  }, [isBookmarked, type, id]);

  // Add hover animations
  useEffect(() => {
    if (!cardRef.current) return;

    // Animation for card hover
    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 40;
      const rotateY = (centerX - x) / 40;

      // Apply the transform with GSAP
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    // Add event listeners
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Clean up event listeners
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Toggle like state with animation
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Update state
    setLiked(!liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));

    // Animate the like button
    if (likeRef.current) {
      const button = likeRef.current;

      if (!liked) {
        // Like animation
        gsap.fromTo(
          button,
          { scale: 1 },
          {
            scale: 1.5,
            duration: 0.3,
            ease: "elastic.out(1.2, 0.5)",
            onComplete: () => {
              gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
              });
            },
          }
        );
      } else {
        // Unlike animation
        gsap.fromTo(
          button,
          { scale: 1 },
          {
            scale: 0.8,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(button, {
                scale: 1,
                duration: 0.2,
              });
            },
          }
        );
      }
    }
  };

  // Toggle bookmark state with animation
  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Toggle bookmark state
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    // Update bookmark in context
    if (newBookmarked) {
      addBookmark({
        id,
        type,
        title,
        image,
        date,
        time,
        location,
        category,
      });
    } else {
      removeBookmark(type, id);
    }

    // Animate the bookmark button
    if (bookmarkRef.current) {
      const button = bookmarkRef.current;

      if (newBookmarked) {
        // Bookmark animation
        gsap.fromTo(
          button,
          { scale: 1, y: 0 },
          {
            scale: 1.3,
            y: -5,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: () => {
              gsap.to(button, {
                scale: 1,
                y: 0,
                duration: 0.2,
                ease: "power2.out",
              });
            },
          }
        );
      } else {
        // Unbookmark animation
        gsap.fromTo(
          button,
          { scale: 1 },
          {
            scale: 0.8,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(button, {
                scale: 1,
                duration: 0.2,
              });
            },
          }
        );
      }
    }
  };

  return (
    <div
      className={`${styles.card} ${compact ? styles.compact : ""}`}
      ref={cardRef}
      data-category={category}
    >
      <Link to={`/detail/${type}/${id}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
          <span className={`${styles.category} ${styles[category]}`}>
            {t(`category.${category}`)}
          </span>
          <div className={styles.dateOverlay}>{formattedDate}</div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>

          <div className={styles.details}>
            <div className={styles.detail}>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span>{time}</span>
            </div>

            <div className={styles.detail}>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>{location}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className={styles.actions}>
        <button
          className={`${styles.action} ${liked ? styles.liked : ""}`}
          onClick={toggleLike}
          ref={likeRef}
          aria-label={liked ? t("action.unlike") : t("action.like")}
        >
          <svg
            className={styles.actionIcon}
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likeCount}</span>
        </button>

        <button
          className={`${styles.action} ${styles.comment}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={t("action.comment")}
        >
          <svg className={styles.actionIcon} viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>{Math.floor(likeCount / 3)}</span>
        </button>

        <button
          className={`${styles.action} ${styles.share}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={t("action.share")}
        >
          <svg className={styles.actionIcon} viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>

        <button
          className={`${styles.action} ${styles.bookmark} ${
            bookmarked ? styles.bookmarked : ""
          }`}
          onClick={toggleBookmark}
          ref={bookmarkRef}
          aria-label={
            bookmarked ? t("action.removeBookmark") : t("action.addBookmark")
          }
        >
          <svg
            className={styles.actionIcon}
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
