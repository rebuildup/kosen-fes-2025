import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { events } from "../data/events";
import { exhibitions } from "../data/exhibitions";
import { foodStalls } from "../data/foodStalls";
import { locations } from "../data/locations";
import MapHeader from "../components/pages/map/MapHeader";
import CampusMap from "../components/pages/map/CampusMap";
import LocationList from "../components/pages/map/LocationList";
import { SearchResult } from "../types/common";
import { Location } from "../types/Location";

const MapPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationItems, setLocationItems] = useState<
    Record<string, SearchResult[]>
  >({});

  // Prepare items by location
  useEffect(() => {
    const allItems: SearchResult[] = [
      ...events.map((event) => ({ ...event, type: "event" as const })),
      ...exhibitions.map((exhibition) => ({
        ...exhibition,
        type: "exhibition" as const,
      })),
      ...foodStalls.map((foodStall) => ({
        ...foodStall,
        type: "foodStall" as const,
      })),
    ];

    // Group items by location
    const itemsByLocation: Record<string, SearchResult[]> = {};

    allItems.forEach((item) => {
      if (!item.location) return;

      if (!itemsByLocation[item.location]) {
        itemsByLocation[item.location] = [];
      }

      itemsByLocation[item.location].push(item);
    });

    setLocationItems(itemsByLocation);
  }, []);

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId === selectedLocation ? null : locationId);
  };

  // Handle item click
  const handleItemClick = (item: SearchResult) => {
    let path = "";

    switch (item.type) {
      case "event":
        path = `/events/${item.id}`;
        break;
      case "exhibition":
        path = `/exhibitions/${item.id}`;
        break;
      case "foodStall":
        path = `/food-stalls/${item.id}`;
        break;
    }

    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="map-page pb-8">
      {/* Map Header */}
      <MapHeader />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left panel: Campus Map */}
          <div className="w-full lg:w-7/12 mb-8 lg:mb-0">
            <CampusMap
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Right panel: Location List */}
          <div className="w-full lg:w-5/12">
            <LocationList
              locations={locations}
              locationItems={locationItems}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
