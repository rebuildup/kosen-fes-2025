// src/pages/Map.tsx
import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { Item, Event, Exhibit, Stall } from "../types/common";
import VectorMap from "../components/map/VectorMap";

import LocationList from "../components/map/LocationList";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";
// import { itemsToContentItems } from "../utils/itemHelpers";

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

  const mapHeight = "70vh";
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const mapEvents = useMemo(
    () => events.filter((event) => event.showOnMap),
    []
  );
  const baseItems = useMemo<NonSponsorItem[]>(
    () => [...mapEvents, ...exhibits, ...stalls],
    [mapEvents]
  );
  const allLocations = useMemo(
    () => [...new Set(baseItems.map((item) => item.location))],
    [baseItems]
  );
  const filteredItems = useMemo(() => {
    if (selectedTags.length === 0) {
      return baseItems;
    }
    return filterItemsByTags(baseItems).filter(isNonSponsorItem);
  }, [baseItems, selectedTags, filterItemsByTags]);
  const locationItems = useMemo(() => {
    const grouped: Record<string, NonSponsorItem[]> = {};

    allLocations.forEach((location) => {
      const itemsAtLocation = filteredItems.filter(
        (item) => item.location === location
      );
      if (itemsAtLocation.length > 0) {
        grouped[location] = itemsAtLocation;
      }
    });

    return grouped;
  }, [allLocations, filteredItems]);

  // Handle location hover
  const handleLocationHover = useCallback((location: string | null) => {
    setHoveredLocation(location);
  }, []);

  // Handle location selection
  const handleLocationSelect = useCallback((location: string | null) => {
    setSelectedLocation((prev) => (location === prev ? null : location));
  }, []);

  // Get items for a specific location - メモ化
  const getItemsForLocation = useCallback(
    (location: string): NonSponsorItem[] => {
      return filteredItems.filter((item) => item.location === location);
    },
    [filteredItems]
  );

  // Get all locations with items - メモ化
  const locationsWithItems = useMemo(
    () => Object.keys(locationItems),
    [locationItems]
  );

  // コンテンツアイテムのメモ化
  // const mapContentItems = useMemo(
  //   () => itemsToContentItems(filteredItems),
  //   [filteredItems]
  // );

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

            {/* Full Width Map */}
            <div className="w-full">
              <div
                className="rounded-lg overflow-hidden relative"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div
                  className="p-4 border-b"
                  style={{ borderColor: "var(--color-border-primary)" }}
                >
                  <h2
                    className="text-xl font-semibold flex items-center gap-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    会場マップ
                  </h2>
                </div>

                <div className="relative">
                  {/* Map Display - Larger size */}
                  <div
                    className="map-container relative m-4"
                    style={{
                      minHeight: mapHeight,
                      backgroundColor: "var(--color-bg-secondary)",
                      borderColor: "var(--color-border-primary)",
                    }}
                  >
                    <VectorMap
                      mode="display"
                      points={filteredItems
                        .filter((item) => item.coordinates)
                        .map((item) => ({
                          id: item.id,
                          coordinates: item.coordinates!,
                          title: item.title,
                          type: item.type as
                            | "event"
                            | "exhibit"
                            | "stall"
                            | "location",
                          isSelected: false,
                          isHovered: false,
                          contentItem: item,
                          onClick: () => {},
                          onHover: () => {},
                        }))}
                      height={mapHeight}
                      className="rounded-lg"
                      maxZoom={8}
                      minZoom={0.3}
                      showControls={true}
                      initialZoom={2}
                    />
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




