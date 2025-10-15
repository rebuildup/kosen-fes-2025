import { useEffect, useMemo, useState } from "react";

import SelectedTags from "../components/common/SelectedTags";
import TagFilter from "../components/common/TagFilter";
import TimelineDay from "../components/schedule/TimelineDay";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import eventsJson from "../data/events.json";
import type { Event, Item } from "../types/common";
const events = eventsJson as Event[];

const isEventItem = (item: Item): item is Event => item.type === "event";

function getStartMinutes(timeRange: string) {
  const [start] = timeRange.split(" - ");
  const [hours, minutes] = start
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  return hours * 60 + minutes;
}

const TimeSchedule = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [selectedDay, setSelectedDay] = useState<"day1" | "day2">("day1");
  const [filteredItems, setFilteredItems] = useState<{
    [key: string]: Event[];
  }>({
    day1: [],
    day2: [],
  });

  // Animation state for smooth transitions
  const [animationKey, setAnimationKey] = useState(0);
  const [prevDayHash, setPrevDayHash] = useState<string>("");
  const [prevTagsHash, setPrevTagsHash] = useState<string>("");

  // Create hashes to detect changes
  const currentDayHash = selectedDay;
  const currentTagsHash = useMemo(() => {
    return selectedTags.join(",");
  }, [selectedTags]);

  // Trigger animation when day changes
  useEffect(() => {
    if (prevDayHash !== "" && prevDayHash !== currentDayHash) {
      setAnimationKey((prev) => prev + 1);
    }
    setPrevDayHash(currentDayHash);
  }, [currentDayHash, prevDayHash]);

  // Trigger animation when tags change
  useEffect(() => {
    if (prevTagsHash !== "" && prevTagsHash !== currentTagsHash) {
      setAnimationKey((prev) => prev + 1);
    }
    setPrevTagsHash(currentTagsHash);
  }, [currentTagsHash, prevTagsHash]);

  // Get all events sorted by time for each day
  useEffect(() => {
    const scheduleEvents = events.filter(
      (eventItem) => eventItem.showOnSchedule,
    );

    const day1Date = "2025-11-08";
    const day2Date = "2025-11-09";

    const filterByTags = (items: Event[]): Event[] => {
      if (selectedTags.length === 0) {
        return items;
      }
      return filterItemsByTags(items).filter(isEventItem);
    };

    const buildDayEvents = (day: "day1" | "day2") => {
      const targetDate = day === "day1" ? day1Date : day2Date;

      const eventsForDay = scheduleEvents
        .filter((eventItem) => {
          if (eventItem.dayAvailability === "both") {
            return true;
          }
          return eventItem.dayAvailability === day;
        })
        .map((eventItem) =>
          eventItem.dayAvailability === "both"
            ? { ...eventItem, date: targetDate }
            : eventItem,
        );

      const taggedEvents = filterByTags(eventsForDay);

      return [...taggedEvents].sort(
        (a: Event, b: Event) =>
          getStartMinutes(a.time) - getStartMinutes(b.time),
      );
    };

    setFilteredItems({
      day1: buildDayEvents("day1"),
      day2: buildDayEvents("day2"),
    });
  }, [selectedTags, filterItemsByTags]);

  // Group items by time slot for better display
  const groupItemsByTimeSlot = (items: Event[]) => {
    const grouped: { [timeSlot: string]: Event[] } = {};

    for (const item of items) {
      const timeSlot = item.time.split(" - ")[0]; // Use start time as the time slot

      if (!grouped[timeSlot]) {
        grouped[timeSlot] = [];
      }

      grouped[timeSlot].push(item);
    }

    return grouped;
  };

  // Get time slots in chronological order
  const getOrderedTimeSlots = (items: Event[]) => {
    const timeSlots = [
      ...new Set(items.map((item) => item.time.split(" - ")[0])),
    ];
    return [...timeSlots].sort(
      (a: string, b: string) => getStartMinutes(a) - getStartMinutes(b),
    );
  };

  return (
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="mx-auto max-w-7xl">
          <h1 className="section-title">{t("schedule.title")}</h1>

          <div className="space-y-8">
            {/* Day selector */}
            <div className="scrollbar-thin flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setSelectedDay("day1")}
                className={`rounded-lg px-16 py-3 text-sm font-medium text-nowrap transition-all duration-200 ${
                  selectedDay === "day1" ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedDay === "day1"
                      ? "var(--color-accent)"
                      : "var(--color-bg-secondary)",
                  borderColor:
                    selectedDay === "day1"
                      ? "var(--color-accent)"
                      : "var(--color-border-primary)",
                  color:
                    selectedDay === "day1"
                      ? "white"
                      : "var(--color-text-primary)",
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
                className={`rounded-lg px-16 py-3 font-medium text-nowrap transition-all duration-200 ${
                  selectedDay === "day2" ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedDay === "day2"
                      ? "var(--color-accent)"
                      : "var(--color-bg-secondary)",
                  borderColor:
                    selectedDay === "day2"
                      ? "var(--color-accent)"
                      : "var(--color-border-primary)",
                  color:
                    selectedDay === "day2"
                      ? "white"
                      : "var(--color-text-primary)",
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
              <TagFilter compact={true} />
              <SelectedTags />
            </div>

            {/* Timeline content */}
            <div>
              {selectedDay === "day1" && (
                <TimelineDay
                  key={`day1-${animationKey}`}
                  date="2025-11-08"
                  items={filteredItems.day1}
                  timeSlots={getOrderedTimeSlots(filteredItems.day1)}
                  groupedItems={groupItemsByTimeSlot(filteredItems.day1)}
                  dayName={t("schedule.day1")}
                  animationKey={animationKey}
                />
              )}

              {selectedDay === "day2" && (
                <TimelineDay
                  key={`day2-${animationKey}`}
                  date="2025-11-09"
                  items={filteredItems.day2}
                  timeSlots={getOrderedTimeSlots(filteredItems.day2)}
                  groupedItems={groupItemsByTimeSlot(filteredItems.day2)}
                  dayName={t("schedule.day2")}
                  animationKey={animationKey}
                />
              )}

              {selectedDay === "day1" && filteredItems.day1.length === 0 && (
                <div
                  className="py-12 text-center text-lg"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("schedule.noEvents")}
                </div>
              )}

              {selectedDay === "day2" && filteredItems.day2.length === 0 && (
                <div
                  className="py-12 text-center text-lg"
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
