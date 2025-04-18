import { useLanguage } from "../../context/LanguageContext";
import { Item } from "../../types/common";
import TimelineItem from "./TimelineItem";

interface TimelineDayProps {
  date: string;
  items: Item[];
  timeSlots: string[];
  groupedItems: { [timeSlot: string]: Item[] };
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
    return <div className="timeline-empty">{t("schedule.noEvents")}</div>;
  }

  return (
    <div className="timeline-day">
      <div className="timeline-date-header">
        <h2 className="timeline-date">{formatDate(date)}</h2>
        <div className="timeline-day-label">{dayName}</div>
      </div>

      <div className="timeline">
        {timeSlots.map((timeSlot, index) => (
          <div key={timeSlot} className="timeline-slot">
            <div className="timeline-time">
              <div className="timeline-time-marker"></div>
              <div className="timeline-time-label">{timeSlot}</div>
            </div>

            <div className="timeline-items">
              {groupedItems[timeSlot].map((item) => (
                <TimelineItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineDay;
