import { useState } from "react";
import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";
import Card from "../common/Card";
import { Item } from "../../types/common";

interface BookmarkFilter {
  type: "all" | "event" | "exhibit" | "stall";
  label: string;
}

const BookmarksList = () => {
  const { bookmarkedItems, clearAllBookmarks } = useBookmark();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  // Define filter options
  const filterOptions: BookmarkFilter[] = [
    { type: "all", label: t("bookmarks.all") },
    { type: "event", label: t("detail.event") },
    { type: "exhibit", label: t("detail.exhibit") },
    { type: "stall", label: t("detail.stall") },
  ];

  // Filter bookmarked items
  const filteredItems = bookmarkedItems.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  // Group by day
  const itemsByDay: { [key: string]: Item[] } = {};
  filteredItems.forEach((item) => {
    if (!itemsByDay[item.date]) {
      itemsByDay[item.date] = [];
    }
    itemsByDay[item.date].push(item);
  });

  // Sort days
  const sortedDays = Object.keys(itemsByDay).sort();

  if (bookmarkedItems.length === 0) {
    return (
      <div className="bookmarks-empty">
        <p>{t("bookmarks.noBookmarks")}</p>
      </div>
    );
  }

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

        <button className="clear-bookmarks-button" onClick={clearAllBookmarks}>
          {t("bookmarks.clearAll")}
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="bookmarks-empty">
          <p>{t("bookmarks.noItemsOfType")}</p>
        </div>
      ) : (
        <>
          {sortedDays.map((day) => (
            <div key={day} className="bookmarks-day">
              <h3 className="bookmarks-day-title">{day}</h3>
              <div className="bookmarks-grid">
                {itemsByDay[day].map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BookmarksList;
