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

  const filterOptions: BookmarkFilter[] = [
    { type: "all", label: t("bookmarks.all") },
    { type: "event", label: t("detail.event") },
    { type: "exhibit", label: t("detail.exhibit") },
    { type: "stall", label: t("detail.stall") },
  ];

  useEffect(() => {
    let filtered = bookmarkedItems;

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

    Object.keys(byDate).forEach((date) => {
      byDate[date].sort((a, b) => {
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
      <div>
        <div>🔖</div>
        <h3>{t("bookmarks.noBookmarks")}</h3>
        <p>{t("bookmarks.startBookmarking")}</p>
      </div>
    );
  }

  const dates = Object.keys(groupedItems).sort();

  return (
    <div>
      <div>
        <div>
          {filterOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => setFilter(option.type)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div>
          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />

          <button
            onClick={clearAllBookmarks}
          >
            {t("bookmarks.clearAll")}
          </button>
        </div>
      </div>

      {dates.length === 0 ? (
        <div>
          <p>{t("bookmarks.noItemsOfType")}</p>
        </div>
      ) : (
        <>
          {dates.map((date) => (
            <div key={date}>
              <h3>{formatDate(date)}</h3>
              <div>
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
