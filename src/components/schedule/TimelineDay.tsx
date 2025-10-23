// src/components/schedule/TimelineDay.tsx
import { useLanguage } from "../../context/LanguageContext";
import UnifiedCard from "../../shared/components/ui/UnifiedCard";
import type { Event, Exhibit, Stall } from "../../types/common";

// Type for non-sponsor items
type NonSponsorItem = Event | Exhibit | Stall;

interface TimelineDayProps {
  date: string;
  items: NonSponsorItem[];
  timeSlots: string[];
  groupedItems: { [timeSlot: string]: NonSponsorItem[] };
  dayName: string;
  animationKey: number;
  onItemClick?: (item: NonSponsorItem) => void;
}

const TimelineDay = ({
  animationKey,
  date,
  dayName,
  groupedItems,
  items,
  onItemClick,
  timeSlots,
}: TimelineDayProps) => {
  const { t } = useLanguage();

  // Calculate progressive delay for timeline items
  const calculateDelay = (timeSlotIndex: number, itemIndex: number): number => {
    const baseDelay = 0.08;
    const minDelay = 0.02;
    const totalItemsBefore = timeSlots.slice(0, timeSlotIndex).reduce((acc, slot) => {
      return acc + groupedItems[slot].length;
    }, 0);
    const absoluteIndex = totalItemsBefore + itemIndex;

    // Use similar progressive algorithm as CardGrid
    if (items.length <= 10) {
      return absoluteIndex * baseDelay;
    }

    const progressFactor = absoluteIndex / (items.length - 1);
    const curve = (1 - progressFactor) ** 0.8;
    const delay = minDelay + (baseDelay - minDelay) * curve;
    const cumulativeBase = absoluteIndex * minDelay * 0.3;

    return delay + cumulativeBase;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t("language") === "ja" ? "ja-JP" : "en-US", {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    });
  };

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-lg" style={{ color: "var(--color-text-secondary)" }}>
        {t("schedule.noEvents")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop: Show date header / Mobile: Hidden */}
      <div
        className="hidden rounded-lg border p-6 shadow-sm md:block"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border-primary)",
        }}
      >
        <h2 className="mb-2 text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {formatDate(date)}
        </h2>
        <div className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
          {dayName}
        </div>
      </div>

      {/* Desktop: Timeline layout / Mobile: Vertical card layout */}
      <div className="space-y-8">
        {timeSlots.map((timeSlot, timeSlotIndex) => (
          <div key={timeSlot}>
            {/* Mobile: Date header between time slots */}
            {timeSlotIndex === 0 && (
              <div className="mb-6 md:hidden">
                <div
                  className="rounded-lg border px-6 py-4 text-center"
                  style={{
                    backgroundColor: "var(--color-bg-primary)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <h2
                    className="mb-1 text-lg font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {formatDate(date)}
                  </h2>
                  <div className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
                    {dayName}
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              {/* Desktop Layout: Side timeline */}
              <div className="hidden items-start gap-6 md:flex">
                <div className="flex w-24 flex-shrink-0 items-center space-x-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                  <div
                    className="text-lg font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {timeSlot}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {groupedItems[timeSlot].map((item, itemIndex) => (
                    <div
                      key={`${animationKey}-${item.id}`}
                      className={"animate-card-enter-list"}
                      style={{
                        animationDelay: `${calculateDelay(timeSlotIndex, itemIndex)}s`,
                        animationFillMode: "both",
                      }}
                    >
                      <UnifiedCard
                        item={item}
                        variant="timeline"
                        showDescription={true}
                        showTags={true}
                        onClick={onItemClick ? () => onItemClick(item) : undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Layout: Full-width cards with time header */}
              <div className="space-y-6 md:hidden">
                {/* Time header for mobile */}
                <div className="flex items-center justify-center">
                  <div
                    className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md"
                    style={{ background: "var(--color-accent)" }}
                  >
                    {timeSlot}
                  </div>
                </div>

                {/* Full-width cards */}
                <div className="space-y-4">
                  {groupedItems[timeSlot].map((item, itemIndex) => (
                    <div
                      key={`${animationKey}-mobile-${item.id}`}
                      className={"animate-card-enter-list"}
                      style={{
                        animationDelay: `${calculateDelay(timeSlotIndex, itemIndex)}s`,
                        animationFillMode: "both",
                      }}
                    >
                      <UnifiedCard
                        item={item}
                        variant="timeline"
                        showDescription={true}
                        showTags={true}
                        onClick={onItemClick ? () => onItemClick(item) : undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: Connection line to next time slot */}
              {timeSlot !== timeSlots.at(-1) && (
                <div
                  className="absolute top-8 bottom-0 left-1.5 hidden w-0.5 md:block"
                  style={{ backgroundColor: "var(--color-border-secondary)" }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineDay;
