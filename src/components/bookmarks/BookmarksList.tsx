import { useState, useEffect } from "react";
import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";
import { Item } from "../../types/common";
import CardGrid from "../common/CardGrid";
import CardListToggle from "../common/CardListToggle";

interface BookmarkFilter {
  type: "all" | "event" | "exhibit" | "stall";
  label: string;
}

const BookmarksList = () => {
  const { bookmarkedItems, clearAllBookmarks } = useBookmark();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});

  // Define filter options
  const filterOptions: BookmarkFilter[] = [
    { type: "all", label: t("bookmarks.all") },
    { type: "event", label: t("detail.event") },
    { type: "exhibit", label: t("detail.exhibit") },
    { type: "stall", label: t("detail.stall") },
  ];

  // Group items by date when bookmarkedItems change
  useEffect(() => {
    let filtered = bookmarkedItems;

    // Apply type filter
    if (filter !== "all") {
      filtered = bookmarkedItems.filter((item) => item.type === filter);
    }

    // Group by date
    const byDate: Record<string, Item[]> = {};
    filtered.forEach((item) => {
      if (!byDate[item.date]) {
        byDate[item.date] = [];
      }
      byDate[item.date].push(item);
    });

    // Sort items in each date group
    Object.keys(byDate).forEach((date) => {
      byDate[date].sort((a, b) => {
        // Sort first by time, then by title
        const aTime = a.time.split(" - ")[0];
        const bTime = b.time.split(" - ")[0];

        if (aTime !== bTime) {
          return aTime.localeCompare(bTime);
        }
        return a.title.localeCompare(b.title);
      });
    });

    setGroupedItems(byDate);
  }, [bookmarkedItems, filter]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(
        t("language") === "ja" ? "ja-JP" : "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch (e) {
      return dateStr;
    }
  };

  if (bookmarkedItems.length === 0) {
    return (
      <div className="bookmarks-empty">
        <div className="bookmarks-empty-icon">🔖</div>
        <h3>{t("bookmarks.noBookmarks")}</h3>
        <p>{t("bookmarks.startBookmarking")}</p>
      </div>
    );
  }

  // Get all dates sorted
  const dates = Object.keys(groupedItems).sort();

  return (
    <div className="bookmarks-list">
      <div className="bookmarks-header">
        <div className="bookmarks-filters">
          {filterOptions.map((option) => (
            <button
              key={option.type}
              className={`filter-button ${
                filter === option.type ? "active" : ""
              }`}
              onClick={() => setFilter(option.type)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="bookmarks-actions">
          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />

          <button
            className="clear-bookmarks-button"
            onClick={clearAllBookmarks}
          >
            {t("bookmarks.clearAll")}
          </button>
        </div>
      </div>

      {dates.length === 0 ? (
        <div className="bookmarks-empty">
          <p>{t("bookmarks.noItemsOfType")}</p>
        </div>
      ) : (
        <>
          {dates.map((date) => (
            <div key={date} className="bookmarks-day">
              <h3 className="bookmarks-day-title">{formatDate(date)}</h3>
              <div className="bookmarks-grid">
                <CardGrid
                  items={groupedItems[date]}
                  variant={viewMode}
                  showTags={true}
                  showDescription={viewMode === "list"}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BookmarksList;
