// src/pages/Map.tsx
import { useCallback, useMemo, useState } from "react";

import SelectedTags from "../components/common/SelectedTags";
import TagFilter from "../components/common/TagFilter";
import LocationList from "../components/map/LocationList";
import VectorMap from "../components/map/VectorMap";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import type { Event, Exhibit, Item, Stall } from "../types/common";
// import { itemsToContentItems } from "../utils/itemHelpers";

// Type for non-sponsor items
type NonSponsorItem = Event | Exhibit | Stall;

// Type guard to check if an item is a non-sponsor item
const isNonSponsorItem = (item: Item): item is NonSponsorItem => {
  return (
    item.type === "event" || item.type === "exhibit" || item.type === "stall"
  );
};

const CampusMapPage = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const mapHeight = "70vh";
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const mapEvents = useMemo(
    () => events.filter((event) => event.showOnMap),
    [],
  );
  const baseItems = useMemo<NonSponsorItem[]>(
    () => [...mapEvents, ...exhibits, ...stalls],
    [mapEvents],
  );
  const allLocations = useMemo(
    () => [...new Set(baseItems.map((item) => item.location))],
    [baseItems],
  );
  const filteredItems = useMemo(() => {
    if (selectedTags.length === 0) {
      return baseItems;
    }
    return filterItemsByTags(baseItems).filter(isNonSponsorItem);
  }, [baseItems, selectedTags, filterItemsByTags]);
  const locationItems = useMemo(() => {
    const grouped: Record<string, NonSponsorItem[]> = {};

    for (const location of allLocations) {
      const itemsAtLocation = filteredItems.filter(
        (item) => item.location === location,
      );
      if (itemsAtLocation.length > 0) {
        grouped[location] = itemsAtLocation;
      }
    }

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
    [filteredItems],
  );

  // Get all locations with items - メモ化
  const locationsWithItems = useMemo(
    () => Object.keys(locationItems),
    [locationItems],
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
        <div className="mx-auto max-w-7xl">
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
              <TagFilter compact={true} />
              <SelectedTags />
            </div>

            {/* Full Width Map */}
            <div className="w-full">
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div
                  className="border-b p-4"
                  style={{ borderColor: "var(--color-border-primary)" }}
                >
                  <h2
                    className="flex items-center gap-2 text-xl font-semibold"
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
                      backgroundColor: "var(--color-bg-secondary)",
                      borderColor: "var(--color-border-primary)",
                      minHeight: mapHeight,
                    }}
                  >
                    <VectorMap
                      mode="display"
                      points={filteredItems
                        .filter((item) => item.coordinates)
                        .map((item) => ({
                          contentItem: item,
                          coordinates: item.coordinates!,
                          id: item.id,
                          isHovered: false,
                          isSelected: false,
                          onClick: () => {},
                          onHover: () => {},
                          title: item.title,
                          type: item.type as
                            | "event"
                            | "exhibit"
                            | "stall"
                            | "location",
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

export default CampusMapPage;
