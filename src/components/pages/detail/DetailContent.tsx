import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { useBookmark } from "../../../hooks/useBookmark";
import { SearchResult } from "../../../types/common";
import ImageWithFallback from "../../common/ImageWithFallback";
import TagList from "../../common/TagList";

interface DetailContentProps {
  item: SearchResult;
  className?: string;
}

const DetailContent: React.FC<DetailContentProps> = ({
  item,
  className = "",
}) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();

  const bookmarked = isBookmarked(item.id, item.type);

  return (
    <div className={`detail-content ${className}`}>
      <div className="bg-background-card rounded-lg shadow-md overflow-hidden">
        {/* Image */}
        <div className="relative">
          <ImageWithFallback
            src={item.image}
            alt={item.title}
            className="w-full h-64 object-cover sm:h-80 md:h-96"
          />

          {/* Bookmark button */}
          <button
            onClick={() => toggleBookmark(item)}
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-110"
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
        <div className="p-6">
          {/* Info Grid */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            {item.date && (
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 text-gray-500 dark:text-gray-400"
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
                  className="h-5 w-5 mr-2 mt-0.5 text-gray-500 dark:text-gray-400"
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
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {t("detail.description")}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">{t("detail.tags")}</h2>
              <TagList
                tags={item.tags}
                clickable
                filterPath={item.type === "event" ? "/events" : "/exhibitions"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailContent;
