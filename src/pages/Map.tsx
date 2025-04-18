import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { Item } from "../types/common";
import MapDisplay from "../components/map/MapDisplay";
import LocationList from "../components/map/LocationList";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";

const Map = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationItems, setLocationItems] = useState<Record<string, Item[]>>(
    {}
  );

  // Get all unique locations
  const allLocations = [
    ...new Set(
      [...events, ...exhibits, ...stalls].map((item) => item.location)
    ),
  ];

  // Group items by location
  useEffect(() => {
    const allItems = [...events, ...exhibits, ...stalls];
    let itemsToFilter = allItems;

    // Apply tag filtering if needed
    if (selectedTags.length > 0) {
      itemsToFilter = filterItemsByTags(allItems);
    }

    setFilteredItems(itemsToFilter);

    // Group items by location
    const groupedByLocation: Record<string, Item[]> = {};

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
  const getItemsForLocation = (location: string): Item[] => {
    return filteredItems.filter((item) => item.location === location);
  };

  // Get all locations with items
  const locationsWithItems = Object.keys(locationItems);

  return (
    <div className="map-page">
      <div className="map-header">
        <h1 className="map-title">{t("map.title")}</h1>
      </div>

      <div className="map-content">
        <div className="map-sidebar">
          <TagFilter onFilter={() => {}} compact={true} />
          <SelectedTags />
        </div>

        <div className="map-main">
          <div className="map-container">
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
