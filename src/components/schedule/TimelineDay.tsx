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
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
        {t("schedule.noEvents")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {formatDate(date)}
        </h2>
        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          {dayName}
        </div>
      </div>

      <div className="space-y-8">
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot} className="relative">
            <div className="flex items-start gap-6">
              <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-max">
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
              <div className="absolute left-1.5 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineDay;