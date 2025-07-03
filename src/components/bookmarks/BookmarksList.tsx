import { useState, useEffect } from "react";
import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";
import { Item } from "../../types/common";
import CardGrid from "../common/CardGrid";
import CardListToggle from "../common/CardListToggle";
import TabButtons from "../common/TabButtons";
import { TrashIcon } from "../icons";

const BookmarksList = () => {
  const { bookmarkedItems, clearAllBookmarks } = useBookmark();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});

  const filterOptions = [
    { value: "all", label: t("exhibits.filters.all") },
    { value: "event", label: t("navigation.events") },
    { value: "exhibit", label: t("exhibits.filters.exhibits") },
    { value: "stall", label: t("exhibits.filters.stalls") },
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
      <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
        <div className="text-6xl mb-4">🔖</div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          {t("bookmarks.empty")}
        </h3>
        <p className="text-[var(--text-secondary)]">
          {t("bookmarks.startBookmarking")}
        </p>
      </div>
    );
  }

  const dates = Object.keys(groupedItems).sort();

  return (
    <div className="space-y-6">
      {/* Filter Controls レスポンシブ横スクロール＋PC右寄せ */}
      <div className="flex w-full items-center gap-2 overflow-x-auto scrollbar-thin py-2 px-1 sm:overflow-x-auto md:overflow-x-visible md:justify-between md:px-0 md:py-0">
        {/* 左: フィルタタブ */}
        <div className="flex-shrink-0">
          <TabButtons
            options={filterOptions}
            activeValue={filter}
            onChange={setFilter}
            className="rounded-lg overflow-hidden shadow-sm"
          />
        </div>
        {/* 右: 表示切替＋削除（PCは右寄せ） */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
          <button
            onClick={clearAllBookmarks}
            className="px-3 py-2 glass-button glass-interactive text-red-500 hover:text-red-600 rounded-lg font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
            title="すべて削除"
          >
            <TrashIcon size={20} />
          </button>
        </div>
      </div>

      {/* Bookmarked Items */}
      {dates.length === 0 ? (
        <div className="text-center py-8 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)]">
            {t("bookmarks.noCategoryItems")}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {dates.map((date) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[var(--accent-purple)] to-[var(--accent-pink)] rounded-full"></div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {formatDate(date)}
                </h3>
                <div className="flex-1 h-px bg-[var(--border-color)]"></div>
                <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                  {groupedItems[date].length} 件
                </span>
              </div>

              <div className="bg-[var(--bg-primary)] rounded-xl p-6">
                <CardGrid
                  items={groupedItems[date]}
                  variant={viewMode}
                  showTags={true}
                  showDescription={viewMode === "list"}
                  emptyMessage={t("bookmarks.noItemsFound")}
                  filterType="all"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksList;
