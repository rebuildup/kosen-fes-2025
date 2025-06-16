// src/components/map/LocationList.tsx
import { useLanguage } from "../../context/LanguageContext";
import { Event, Exhibit, Stall } from "../../types/common";
import UnifiedCard from "../../shared/components/ui/UnifiedCard";

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

  // Sort locations alphabetically
  const sortedLocations = [...locations].sort();

  return (
    <div
      className="rounded-lg p-6 backdrop-blur-md bg-white/10 border border-white/20"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <h2
        className="text-xl font-semibold mb-6 flex items-center gap-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        <span>📍</span>
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
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
            {sortedLocations.map((location) => {
              const items = getItemsForLocation(location);
              // Get the first item for the card display
              const firstItem = items[0];

              if (!firstItem) return null;

              return (
                <div
                  key={location}
                  className={`
                    flex-shrink-0 w-72 transition-all duration-200
                    ${
                      hoveredLocation === location
                        ? "ring-2 ring-white/50 rounded-lg"
                        : ""
                    }
                    ${
                      selectedLocation === location
                        ? "ring-2 ring-white/80 rounded-lg"
                        : ""
                    }
                  `}
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
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white">
                      <div className="text-sm font-semibold">{location}</div>
                      <div className="text-xs opacity-80">
                        {items.length} {items.length === 1 ? "項目" : "項目"}
                      </div>
                    </div>

                    {/* Type breakdown badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
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
                          const parts = [];
                          if (eventCount > 0) parts.push(`🎭${eventCount}`);
                          if (exhibitCount > 0) parts.push(`🏛️${exhibitCount}`);
                          if (stallCount > 0) parts.push(`🍕${stallCount}`);
                          return parts.join(" ");
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
