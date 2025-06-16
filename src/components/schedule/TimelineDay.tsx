// src/components/schedule/TimelineDay.tsx
import { useLanguage } from "../../context/LanguageContext";
import { Event, Exhibit, Stall } from "../../types/common";
import TimelineItem from "./TimelineItem";

// Type for non-sponsor items
type NonSponsorItem = Event | Exhibit | Stall;

interface TimelineDayProps {
  date: string;
  items: NonSponsorItem[];
  timeSlots: string[];
  groupedItems: { [timeSlot: string]: NonSponsorItem[] };
  dayName: string;
}

const TimelineDay = ({
  date,
  items,
  timeSlots,
  groupedItems,
  dayName,
}: TimelineDayProps) => {
  const { t } = useLanguage();

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t("language") === "ja" ? "ja-JP" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (items.length === 0) {
    return (
      <div
        className="text-center py-12 text-lg"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {t("schedule.noEvents")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-lg p-6 shadow-sm border"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border-primary)",
        }}
      >
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {formatDate(date)}
        </h2>
        <div
          className="text-sm font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          {dayName}
        </div>
      </div>

      <div className="space-y-8">
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot} className="relative">
            <div className="flex items-start gap-6">
              <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                ></div>
                <div
                  className="text-lg font-semibold min-w-max"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {timeSlot}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {groupedItems[timeSlot].map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Connection line to next time slot */}
            {timeSlot !== timeSlots[timeSlots.length - 1] && (
              <div
                className="absolute left-1.5 top-8 bottom-0 w-0.5"
                style={{ backgroundColor: "var(--color-border-secondary)" }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineDay;
