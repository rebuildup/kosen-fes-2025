import { useEffect, useState } from "react";

import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";
import type { Item } from "../../types/common";
import CardGrid from "../common/CardGrid";
import CardListToggle from "../common/CardListToggle";
import TabButtons from "../common/TabButtons";
import { TrashIcon } from "../icons";

const BookmarksList = () => {
  const { bookmarkedItems, clearAllBookmarks } = useBookmark();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"default" | "compact" | "grid" | "list">("default");
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});

  const filterOptions = [
    { label: t("exhibits.filters.all"), value: "all" },
    { label: t("navigation.events"), value: "event" },
    { label: t("exhibits.filters.exhibits"), value: "exhibit" },
    { label: t("exhibits.filters.stalls"), value: "stall" },
  ];

  useEffect(() => {
    let filtered = bookmarkedItems;

    if (filter !== "all") {
      filtered = bookmarkedItems.filter((item) => item.type === filter);
    }

    // Group by date
    const byDate: Record<string, Item[]> = {};
    for (const item of filtered) {
      if (!byDate[item.date]) {
        byDate[item.date] = [];
      }
      byDate[item.date].push(item);
    }

    for (const date of Object.keys(byDate)) {
      byDate[date].sort((a, b) => {
        const aTime = a.time.split(" - ")[0];
        const bTime = b.time.split(" - ")[0];

        if (aTime !== bTime) {
          return aTime.localeCompare(bTime);
        }
        return a.title.localeCompare(b.title);
      });
    }

    setGroupedItems(byDate);
  }, [bookmarkedItems, filter]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(t("language") === "ja" ? "ja-JP" : "en-US", {
        day: "numeric",
        month: "long",
        weekday: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Failed to format bookmark date", error);
      return dateStr;
    }
  };

  if (bookmarkedItems.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] py-12 text-center">
        <div className="mb-4 text-6xl">🔖</div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
          {t("bookmarks.empty")}
        </h3>
        <p className="text-[var(--text-secondary)]">{t("bookmarks.startBookmarking")}</p>
      </div>
    );
  }

  const dates = Object.keys(groupedItems).sort((a: string, b: string) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      {/* Filter Controls レスポンシブ横スクロール＋PC右寄せ */}
      <div className="scrollbar-thin flex w-full items-center gap-2 overflow-x-auto px-1 py-2 sm:overflow-x-auto md:justify-between md:overflow-x-visible md:px-0 md:py-0">
        {/* 左: フィルタタブ */}
        <div className="flex-shrink-0">
          <TabButtons
            options={filterOptions}
            activeValue={filter}
            onChange={setFilter}
            className="overflow-hidden rounded-lg shadow-sm"
          />
        </div>
        {/* 右: 表示切替＋削除（PCは右寄せ） */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
          <button
            type="button"
            onClick={clearAllBookmarks}
            className="glass-button glass-interactive rounded-lg px-3 py-2 font-medium text-red-500 transition-all duration-200 hover:text-red-600 hover:shadow-lg focus:ring-2 focus:ring-red-500/20 focus:outline-none"
            title="すべて削除"
          >
            <TrashIcon size={20} />
          </button>
        </div>
      </div>

      {/* Bookmarked Items */}
      {dates.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] py-8 text-center">
          <p className="text-[var(--text-secondary)]">{t("bookmarks.noCategoryItems")}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {dates.map((date: string) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[var(--accent-purple)] to-[var(--accent-pink)]" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {formatDate(date)}
                </h3>
                <div className="h-px flex-1 bg-[var(--border-color)]" />
                <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-sm text-[var(--text-secondary)]">
                  {groupedItems[date].length} 件
                </span>
              </div>

              <div className="rounded-xl bg-[var(--bg-primary)] p-6">
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
