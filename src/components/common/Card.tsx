import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useBookmark } from "../../hooks/useBookmark";
import { SearchResult } from "../../types/common";
import ImageWithFallback from "./ImageWithFallback";
import TagList from "./TagList";

interface CardProps {
  title: string;
  image: string;
  description?: string;
  tags?: string[];
  date?: string;
  location?: string;
  item?: SearchResult;
  linkTo?: string;
  showBookmarkButton?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  image,
  description,
  tags = [],
  date,
  location,
  item,
  linkTo,
  showBookmarkButton = false,
  className = "",
  onClick,
}) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [isHovered, setIsHovered] = useState(false);

  // Check if the item is bookmarked
  const bookmarked = item ? isBookmarked(item.id, item.type) : false;

  // Handle bookmark toggle
  const handleBookmarkClick = (e: React.MouseEvent) => {
    if (!item) return;

    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item);
  };

  // Card content
  const cardContent = (
    <div
      className={`card relative overflow-hidden rounded-lg bg-background-card shadow-md transition-all duration-200 
                 hover:shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Card Image with Hover Effect */}
      <div className="card-image-container relative h-48">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />

        {/* Hover Information Overlay */}
        <div
          className={`card-hover-overlay absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity duration-200 
                     ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          {date && (
            <div className="card-info-item mb-1 flex items-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{date}</span>
            </div>
          )}

          {location && (
            <div className="card-info-item flex items-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        {showBookmarkButton && item && (
          <button
            onClick={handleBookmarkClick}
            className={`absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-md transition-all duration-200 
                     hover:scale-110 dark:bg-gray-800/90 ${
                       isHovered ? "opacity-100" : "opacity-0"
                     }`}
            aria-label={bookmarked ? t("bookmarks.remove") : t("bookmarks.add")}
          >
            {bookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14V6H4v10h12z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M9 11a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 mb-2 text-lg font-semibold">{title}</h3>

        {description && (
          <p className="line-clamp-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="card-tags mt-2">
            <TagList tags={tags.slice(0, 3)} />
            {tags.length > 3 && (
              <span className="ml-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // If linkTo is provided, wrap with Link component
  if (linkTo) {
    return (
      <Link to={linkTo} className="block text-current no-underline">
        {cardContent}
      </Link>
    );
  }

  // Otherwise return the raw card
  return cardContent;
};

export default Card;
