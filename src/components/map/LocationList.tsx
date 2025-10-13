// src/components/map/LocationList.tsx
import { useLanguage } from "../../context/LanguageContext";
import { Event, Exhibit, Stall } from "../../types/common";
import UnifiedCard from "../../shared/components/ui/UnifiedCard";
import { EventIcon, ExhibitIcon, PeopleIcon } from "../icons";

// Type for non-sponsor items
type NonSponsorItem = Event | Exhibit | Stall;

interface LocationListProps {
  locations: string[];
  getItemsForLocation: (location: string) => NonSponsorItem[];
  hoveredLocation: string | null;
  selectedLocation: string | null;
  onLocationHover: (location: string | null) => void;
  onLocationSelect: (location: string | null) => void;
}

const LocationList = ({
  locations,
  getItemsForLocation,
  hoveredLocation,
  selectedLocation,
  onLocationHover,
  onLocationSelect,
}: LocationListProps) => {
  const { t } = useLanguage();

  // Keep references to these props to avoid unused variable warnings
  void hoveredLocation;
  void selectedLocation;

  // Sort locations by number of items (descending), then alphabetically
  const sortedLocations = [...locations].sort((a, b) => {
    const lenA = getItemsForLocation(a).length;
    const lenB = getItemsForLocation(b).length;
    if (lenA !== lenB) return lenB - lenA;
    return a.localeCompare(b);
  });

  return (
    <div
      className="rounded-lg p-6 bg-white/10 border border-white/20"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <h2
        className="text-xl font-semibold mb-6 flex items-center gap-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t("map.viewLocations")} ({sortedLocations.length})
      </h2>

      {sortedLocations.length === 0 ? (
        <div
          className="text-center py-8"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("map.noLocations")}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
            {sortedLocations.map((location) => {
              const items = getItemsForLocation(location);
              // Get the first item for the card display
              const firstItem = items[0];

              if (!firstItem) return null;

              return (
                <div
                  key={location}
                  className={`flex-shrink-0 w-72`}
                  onMouseEnter={() => onLocationHover(location)}
                  onMouseLeave={() => onLocationHover(null)}
                  onClick={() => onLocationSelect(location)}
                >
                  <div className="relative">
                    <UnifiedCard
                      item={firstItem}
                      variant="compact"
                      showTags={false}
                      showDescription={false}
                    />

                    {/* Location info overlay */}
                    <div className="absolute top-2 left-2 bg-black/80 rounded-lg px-3 py-1 text-white">
                      <div className="text-sm font-semibold">{location}</div>
                      <div className="text-xs opacity-80">
                        {items.length} {items.length === 1 ? "項目" : "項目"}
                      </div>
                    </div>

                    {/* Type breakdown badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 rounded-lg px-2 py-1">
                      <div className="text-xs text-white">
                        {(() => {
                          const eventCount = items.filter(
                            (item) => item.type === "event"
                          ).length;
                          const exhibitCount = items.filter(
                            (item) => item.type === "exhibit"
                          ).length;
                          const stallCount = items.filter(
                            (item) => item.type === "stall"
                          ).length;

                          return (
                            <div className="flex items-center gap-3">
                              {eventCount > 0 && (
                                <div
                                  className="flex items-center gap-1"
                                  aria-label={`${eventCount} イベント`}
                                >
                                  <EventIcon size={14} />
                                  <span className="text-xs text-white">
                                    {eventCount}
                                  </span>
                                </div>
                              )}
                              {exhibitCount > 0 && (
                                <div
                                  className="flex items-center gap-1"
                                  aria-label={`${exhibitCount} 展示`}
                                >
                                  <ExhibitIcon size={14} />
                                  <span className="text-xs text-white">
                                    {exhibitCount}
                                  </span>
                                </div>
                              )}
                              {stallCount > 0 && (
                                <div
                                  className="flex items-center gap-1"
                                  aria-label={`${stallCount} 出店`}
                                >
                                  <PeopleIcon size={14} />
                                  <span className="text-xs text-white">
                                    {stallCount}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationList;
