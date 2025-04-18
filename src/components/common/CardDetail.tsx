import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { SearchResult } from "../../types/common";
import { useBookmark } from "../../hooks/useBookmark";
import ImageWithFallback from "./ImageWithFallback";
import TagList from "./TagList";

interface CardDetailProps {
  item: SearchResult;
  className?: string;
  showBackLink?: boolean;
  backPath?: string;
}

const CardDetail: React.FC<CardDetailProps> = ({
  item,
  className = "",
  showBackLink = true,
  backPath,
}) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();

  const bookmarked = isBookmarked(item.id, item.type);

  // Determine back link path
  const getBackPath = () => {
    if (backPath) return backPath;

    switch (item.type) {
      case "event":
        return "/events";
      case "exhibition":
        return "/exhibitions";
      case "foodStall":
        return "/exhibitions";
      default:
        return "/";
    }
  };

  return (
    <div className={`card-detail ${className}`}>
      {/* Back link */}
      {showBackLink && (
        <Link
          to={getBackPath()}
          className="mb-4 inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t("detail.backToList")}
        </Link>
      )}

      {/* Image and primary info */}
      <div className="mb-6 overflow-hidden rounded-lg bg-background-card shadow-md">
        {/* Image */}
        <div className="relative">
          <ImageWithFallback
            src={item.image}
            alt={item.title}
            className="h-64 w-full object-cover sm:h-80"
          />

          {/* Bookmark button */}
          <button
            onClick={() => toggleBookmark(item)}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 shadow-md transition-transform duration-200 hover:scale-110 dark:bg-gray-800/90"
            aria-label={bookmarked ? t("bookmarks.remove") : t("bookmarks.add")}
          >
            {bookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-500"
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
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
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
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h1 className="mb-4 text-2xl font-bold sm:text-3xl">{item.title}</h1>

          {/* Info Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Date */}
            {item.date && (
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("detail.date")}
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {item.date}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {item.location && (
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("detail.location")}
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {item.location}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold">
                {t("detail.description")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">{t("detail.tags")}</h2>
              <TagList tags={item.tags} clickable filterPath={getBackPath()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
