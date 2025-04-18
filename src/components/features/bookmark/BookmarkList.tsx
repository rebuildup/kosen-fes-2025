// src/components/features/bookmark/BookmarkList.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useBookmark } from "./BookmarkContext";
import { useLanguage } from "../../../hooks/useLanguage";
import { SearchResult } from "../../../types/common";
import Card from "../../common/Card";
import TagList from "../../common/TagList";

interface BookmarkListProps {
  compact?: boolean;
  className?: string;
}

type GroupType = "event" | "exhibition" | "foodStall" | "all";

const BookmarkList: React.FC<BookmarkListProps> = ({
  compact = false,
  className = "",
}) => {
  const { t } = useLanguage();
  const { bookmarks } = useBookmark();
  const [activeGroup, setActiveGroup] = React.useState<GroupType>("all");

  // Filter bookmarks by group
  const filteredBookmarks =
    activeGroup === "all"
      ? bookmarks
      : bookmarks.filter((bookmark) => bookmark.type === activeGroup);

  // Count items by type
  const eventCount = bookmarks.filter((item) => item.type === "event").length;
  const exhibitionCount = bookmarks.filter(
    (item) => item.type === "exhibition"
  ).length;
  const foodStallCount = bookmarks.filter(
    (item) => item.type === "foodStall"
  ).length;

  // Generate detail page URL based on bookmark type
  const getDetailUrl = (bookmark: SearchResult) => {
    switch (bookmark.type) {
      case "event":
        return `/events/${bookmark.id}`;
      case "exhibition":
        return `/exhibitions/${bookmark.id}`;
      case "foodStall":
        return `/food-stalls/${bookmark.id}`;
      default:
        return "#";
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className={`bookmark-list-empty ${className} text-center py-12`}>
        <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">
          {t("bookmarks.noBookmarks")}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {t("bookmarks.emptyDescription")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            {t("bookmarks.discoverEvents")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bookmark-list ${className}`}>
      {/* Filter tabs */}
      <div className="flex overflow-x-auto mb-6 pb-1">
        <button
          onClick={() => setActiveGroup("all")}
          className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap
                    ${
                      activeGroup === "all"
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
        >
          {t("bookmarks.all")} ({bookmarks.length})
        </button>

        {eventCount > 0 && (
          <button
            onClick={() => setActiveGroup("event")}
            className={`ml-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap
                      ${
                        activeGroup === "event"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
          >
            {t("header.events")} ({eventCount})
          </button>
        )}

        {exhibitionCount > 0 && (
          <button
            onClick={() => setActiveGroup("exhibition")}
            className={`ml-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap
                      ${
                        activeGroup === "exhibition"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
          >
            {t("exhibitions.exhibitions")} ({exhibitionCount})
          </button>
        )}

        {foodStallCount > 0 && (
          <button
            onClick={() => setActiveGroup("foodStall")}
            className={`ml-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap
                      ${
                        activeGroup === "foodStall"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
          >
            {t("exhibitions.foodStalls")} ({foodStallCount})
          </button>
        )}
      </div>

      {/* Bookmarks grid or list */}
      {compact ? (
        // Compact view
        <div className="space-y-3">
          {filteredBookmarks.map((bookmark) => (
            <Link
              key={`${bookmark.type}-${bookmark.id}`}
              to={getDetailUrl(bookmark)}
              className="block"
            >
              <div className="flex items-center p-3 bg-background-card rounded-lg hover:bg-background-card-hover transition-colors duration-200">
                <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                  <img
                    src={bookmark.image}
                    alt={bookmark.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{bookmark.title}</h3>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {bookmark.type === "event" && (
                      <span className="mr-2">{t("header.events")}</span>
                    )}
                    {bookmark.type === "exhibition" && (
                      <span className="mr-2">
                        {t("exhibitions.exhibitions")}
                      </span>
                    )}
                    {bookmark.type === "foodStall" && (
                      <span className="mr-2">
                        {t("exhibitions.foodStalls")}
                      </span>
                    )}
                    {bookmark.date && <span>{bookmark.date}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Card grid view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredBookmarks.map((bookmark) => (
            <Card
              key={`${bookmark.type}-${bookmark.id}`}
              title={bookmark.title}
              image={bookmark.image}
              description={bookmark.description}
              tags={bookmark.tags}
              date={bookmark.date}
              location={bookmark.location}
              item={bookmark}
              showBookmarkButton
              linkTo={getDetailUrl(bookmark)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
