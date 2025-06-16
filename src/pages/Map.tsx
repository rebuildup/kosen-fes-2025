// src/pages/Map.tsx
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { Item, Event, Exhibit, Stall } from "../types/common";
import MapDisplay from "../components/map/MapDisplay";
import LocationList from "../components/map/LocationList";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";

// Type for non-sponsor items
type NonSponsorItem = Event | Exhibit | Stall;

// Type guard to check if an item is a non-sponsor item
const isNonSponsorItem = (item: Item): item is NonSponsorItem => {
  return (
    item.type === "event" || item.type === "exhibit" || item.type === "stall"
  );
};

const Map = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [filteredItems, setFilteredItems] = useState<NonSponsorItem[]>([]);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationItems, setLocationItems] = useState<
    Record<string, NonSponsorItem[]>
  >({});

  // Get all unique locations
  const allLocations = [
    ...new Set(
      [...events, ...exhibits, ...stalls].map((item) => item.location)
    ),
  ];

  // Group items by location
  useEffect(() => {
    // Start with only events, exhibits, and stalls (no sponsors)
    const baseItems: NonSponsorItem[] = [...events, ...exhibits, ...stalls];
    let itemsToFilter = baseItems;

    // Apply tag filtering if needed
    if (selectedTags.length > 0) {
      // Filter items and ensure we only keep non-sponsor items
      const filteredByTags = filterItemsByTags(baseItems);
      itemsToFilter = filteredByTags.filter(isNonSponsorItem);
    }

    setFilteredItems(itemsToFilter);

    // Group items by location
    const groupedByLocation: Record<string, NonSponsorItem[]> = {};

    allLocations.forEach((location) => {
      const itemsAtLocation = itemsToFilter.filter(
        (item) => item.location === location
      );
      if (itemsAtLocation.length > 0) {
        groupedByLocation[location] = itemsAtLocation;
      }
    });

    setLocationItems(groupedByLocation);
  }, [selectedTags, filterItemsByTags, allLocations]);

  // Handle location hover
  const handleLocationHover = (location: string | null) => {
    setHoveredLocation(location);
  };

  // Handle location selection
  const handleLocationSelect = (location: string | null) => {
    setSelectedLocation(location === selectedLocation ? null : location);
  };

  // Get items for a specific location
  const getItemsForLocation = (location: string): NonSponsorItem[] => {
    return filteredItems.filter((item) => item.location === location);
  };

  // Get all locations with items
  const locationsWithItems = Object.keys(locationItems);

  return (
    <div className="min-h-screen">
      <section
        className="section py-8"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("map.title")}
            </h1>
          </div>

          <div className="space-y-6">
            {/* Filter Section */}
            <div className="space-y-4">
              <TagFilter onFilter={() => {}} compact={true} />
              <SelectedTags />
            </div>

            {/* Full Width Map with margins */}
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <div
                className="rounded-lg overflow-hidden relative"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: "var(--color-border-primary)" }}
                >
                  <h2
                    className="text-xl font-semibold flex items-center gap-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    <span>🗺️</span>
                    会場マップ
                  </h2>
                </div>

                <div className="relative">
                  {/* Map Display */}
                  <div className="map-container relative min-h-96 w-full">
                    <MapDisplay
                      hoveredLocation={hoveredLocation}
                      selectedLocation={selectedLocation}
                      onLocationHover={handleLocationHover}
                      onLocationSelect={handleLocationSelect}
                      locations={locationsWithItems}
                    />
                  </div>

                  {/* Area List Overlay on Map */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                        <span>📍</span>
                        エリア一覧 ({locationsWithItems.length})
                      </h3>

                      <div className="overflow-x-auto">
                        <div
                          className="flex gap-3 pb-2"
                          style={{ minWidth: "max-content" }}
                        >
                          {locationsWithItems.map((location) => {
                            const items = getItemsForLocation(location);
                            // Get the first item with an image for the card thumbnail
                            const thumbnailItem =
                              items.find((item) => item.imageUrl) || items[0];
                            const thumbnailImage =
                              thumbnailItem?.imageUrl ||
                              `/images/${thumbnailItem?.type}s/${
                                thumbnailItem?.type
                              }-${thumbnailItem?.id.split("-")[1]}.jpg` ||
                              `/images/placeholder.jpg`;

                            return (
                              <div
                                key={location}
                                className={`
                                  group relative rounded-lg overflow-hidden cursor-pointer
                                  transition-all duration-200 hover:shadow-lg hover:-translate-y-1
                                  w-48 h-32 flex-shrink-0 backdrop-blur-md bg-white/10 border border-white/20
                                  ${
                                    hoveredLocation === location
                                      ? "ring-2 ring-white/50"
                                      : ""
                                  }
                                  ${
                                    selectedLocation === location
                                      ? "ring-2 ring-white/80"
                                      : ""
                                  }
                                `}
                                onMouseEnter={() =>
                                  handleLocationHover(location)
                                }
                                onMouseLeave={() => handleLocationHover(null)}
                                onClick={() => handleLocationSelect(location)}
                              >
                                {/* Card Image */}
                                <img
                                  src={thumbnailImage}
                                  alt={location}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white">
                                  {/* Item count badge */}
                                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium border border-white/30">
                                    {items.length}
                                  </div>

                                  {/* Location info */}
                                  <div className="absolute bottom-0 left-0 right-0 p-2">
                                    <h4 className="font-semibold text-sm mb-1 truncate">
                                      {location}
                                    </h4>

                                    {/* Type breakdown on hover */}
                                    <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                                        if (eventCount > 0)
                                          parts.push(`イベント ${eventCount}`);
                                        if (exhibitCount > 0)
                                          parts.push(`展示 ${exhibitCount}`);
                                        if (stallCount > 0)
                                          parts.push(`露店 ${stallCount}`);
                                        return parts.join(" • ");
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separate Location List section below map */}
        <div className="mt-6">
          <LocationList
            locations={locationsWithItems}
            getItemsForLocation={getItemsForLocation}
            onLocationSelect={handleLocationSelect}
            onLocationHover={handleLocationHover}
            hoveredLocation={hoveredLocation}
            selectedLocation={selectedLocation}
          />
        </div>
      </section>
    </div>
  );
};

export default Map;
