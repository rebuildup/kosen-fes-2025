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
    <div>
      <div>
        <h1>{t("map.title")}</h1>
      </div>

      <div>
        <div>
          <TagFilter onFilter={() => {}} compact={true} />
          <SelectedTags />
        </div>

        <div>
          <div>
            <MapDisplay
              hoveredLocation={hoveredLocation}
              selectedLocation={selectedLocation}
              onLocationHover={handleLocationHover}
              onLocationSelect={handleLocationSelect}
              locations={locationsWithItems}
            />

            <LocationList
              locations={locationsWithItems}
              getItemsForLocation={getItemsForLocation}
              hoveredLocation={hoveredLocation}
              selectedLocation={selectedLocation}
              onLocationHover={handleLocationHover}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
