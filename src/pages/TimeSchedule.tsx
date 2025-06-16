import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { Item, Event, Exhibit, Stall } from "../types/common";
import SelectedTags from "../components/common/SelectedTags";
import TagFilter from "../components/common/TagFilter";
import TimelineDay from "../components/schedule/TimelineDay";

// Type for non-sponsor items
type NonSponsorItem = Event | Exhibit | Stall;

// Type guard to check if an item is a non-sponsor item
const isNonSponsorItem = (item: Item): item is NonSponsorItem => {
  return (
    item.type === "event" || item.type === "exhibit" || item.type === "stall"
  );
};

const TimeSchedule = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [selectedDay, setSelectedDay] = useState<"day1" | "day2">("day1");
  const [filteredItems, setFilteredItems] = useState<{
    [key: string]: NonSponsorItem[];
  }>({
    day1: [],
    day2: [],
  });

  // Get all items sorted by time for each day
  useEffect(() => {
    // Start with only events, exhibits, and stalls (no sponsors)
    const baseItems: NonSponsorItem[] = [...events, ...exhibits, ...stalls];

    // Group items by date
    const day1 = "2025-06-15";
    const day2 = "2025-06-16";

    let day1Items = baseItems.filter((item) => item.date === day1);
    let day2Items = baseItems.filter((item) => item.date === day2);

    // Apply tag filtering if any tags are selected
    if (selectedTags.length > 0) {
      // Filter items and ensure we only keep non-sponsor items
      const day1FilteredByTags =
        filterItemsByTags(day1Items).filter(isNonSponsorItem);
      const day2FilteredByTags =
        filterItemsByTags(day2Items).filter(isNonSponsorItem);

      day1Items = day1FilteredByTags;
      day2Items = day2FilteredByTags;
    }

    // Sort items by time
    const sortByTime = (a: NonSponsorItem, b: NonSponsorItem) => {
      // Extract hours and minutes from time strings (format: "HH:MM - HH:MM")
      const aStartTime = a.time.split(" - ")[0];
      const bStartTime = b.time.split(" - ")[0];

      // Compare times
      return aStartTime.localeCompare(bStartTime);
    };

    day1Items.sort(sortByTime);
    day2Items.sort(sortByTime);

    setFilteredItems({
      day1: day1Items,
      day2: day2Items,
    });
  }, [selectedTags, filterItemsByTags]);

  // Group items by time slot for better display
  const groupItemsByTimeSlot = (items: NonSponsorItem[]) => {
    const grouped: { [timeSlot: string]: NonSponsorItem[] } = {};

    items.forEach((item) => {
      const timeSlot = item.time.split(" - ")[0]; // Use start time as the time slot

      if (!grouped[timeSlot]) {
        grouped[timeSlot] = [];
      }

      grouped[timeSlot].push(item);
    });

    return grouped;
  };

  // Get time slots in chronological order
  const getOrderedTimeSlots = (items: NonSponsorItem[]) => {
    const timeSlots = Array.from(
      new Set(items.map((item) => item.time.split(" - ")[0]))
    );
    return timeSlots.sort();
  };

  return (
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title">{t("schedule.title")}</h1>

          <div className="space-y-8">
            {/* Day selector */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDay("day1")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedDay === "day1" ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedDay === "day1"
                      ? "var(--color-accent)"
                      : "var(--color-bg-secondary)",
                  color:
                    selectedDay === "day1"
                      ? "white"
                      : "var(--color-text-primary)",
                  borderColor:
                    selectedDay === "day1"
                      ? "var(--color-accent)"
                      : "var(--color-border-primary)",
                }}
                onMouseEnter={(e) => {
                  if (selectedDay !== "day1") {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-bg-tertiary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDay !== "day1") {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-bg-secondary)";
                  }
                }}
              >
                {t("schedule.day1")}
              </button>
              <button
                onClick={() => setSelectedDay("day2")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedDay === "day2" ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedDay === "day2"
                      ? "var(--color-accent)"
                      : "var(--color-bg-secondary)",
                  color:
                    selectedDay === "day2"
                      ? "white"
                      : "var(--color-text-primary)",
                  borderColor:
                    selectedDay === "day2"
                      ? "var(--color-accent)"
                      : "var(--color-border-primary)",
                }}
                onMouseEnter={(e) => {
                  if (selectedDay !== "day2") {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-bg-tertiary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDay !== "day2") {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-bg-secondary)";
                  }
                }}
              >
                {t("schedule.day2")}
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <TagFilter onFilter={() => {}} compact={true} />
              <SelectedTags />
            </div>

            {/* Timeline content */}
            <div>
              {selectedDay === "day1" && (
                <TimelineDay
                  date="2025-06-15"
                  items={filteredItems.day1}
                  timeSlots={getOrderedTimeSlots(filteredItems.day1)}
                  groupedItems={groupItemsByTimeSlot(filteredItems.day1)}
                  dayName={t("schedule.day1")}
                />
              )}

              {selectedDay === "day2" && (
                <TimelineDay
                  date="2025-06-16"
                  items={filteredItems.day2}
                  timeSlots={getOrderedTimeSlots(filteredItems.day2)}
                  groupedItems={groupItemsByTimeSlot(filteredItems.day2)}
                  dayName={t("schedule.day2")}
                />
              )}

              {selectedDay === "day1" && filteredItems.day1.length === 0 && (
                <div
                  className="text-center py-12 text-lg"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("schedule.noEvents")}
                </div>
              )}

              {selectedDay === "day2" && filteredItems.day2.length === 0 && (
                <div
                  className="text-center py-12 text-lg"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("schedule.noEvents")}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TimeSchedule;
