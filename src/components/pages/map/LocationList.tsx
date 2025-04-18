import React, { useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { Location } from "../../../types/Location";
import { SearchResult } from "../../../types/common";
import LocationCard from "./LocationCard";

interface LocationListProps {
  locations: Location[];
  locationItems: Record<string, SearchResult[]>;
  selectedLocation: string | null;
  onLocationSelect: (locationId: string) => void;
  onItemClick: (item: SearchResult) => void;
  className?: string;
}

const LocationList: React.FC<LocationListProps> = ({
  locations,
  locationItems,
  selectedLocation,
  onLocationSelect,
  onItemClick,
  className = "",
}) => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>("all");

  // Get items for a location
  const getLocationItems = (locationName: string) => {
    return locationItems[locationName] || [];
  };

  // Filter items by type
  const filterItemsByType = (items: SearchResult[]) => {
    if (filterType === "all") return items;
    return items.filter((item) => item.type === filterType);
  };

  // Count items by type
  const countItemsByType = (items: SearchResult[], type: string) => {
    return items.filter((item) => item.type === type).length;
  };

  return (
    <div className={`location-list ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("map.locations")}</h2>

        {/* Filter buttons */}
        <div className="flex space-x-1">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 text-sm rounded-md
                      ${
                        filterType === "all"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
          >
            {t("map.all")}
          </button>
          <button
            onClick={() => setFilterType("event")}
            className={`px-3 py-1 text-sm rounded-md
                      ${
                        filterType === "event"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
          >
            {t("header.events")}
          </button>
          <button
            onClick={() => setFilterType("exhibition")}
            className={`px-3 py-1 text-sm rounded-md
                      ${
                        filterType === "exhibition"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
          >
            {t("exhibitions.exhibitions")}
          </button>
          <button
            onClick={() => setFilterType("foodStall")}
            className={`px-3 py-1 text-sm rounded-md
                      ${
                        filterType === "foodStall"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
          >
            {t("exhibitions.foodStalls")}
          </button>
        </div>
      </div>

      {/* Locations */}
      <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
        {locations.map((location) => {
          const items = getLocationItems(location.name);
          const filteredItems = filterItemsByType(items);

          // Skip locations with no items matching the filter
          if (filteredItems.length === 0) return null;

          // Calculate counts
          const eventCount = countItemsByType(items, "event");
          const exhibitionCount = countItemsByType(items, "exhibition");
          const foodStallCount = countItemsByType(items, "foodStall");

          return (
            <div key={location.id} className="location-group">
              <button
                onClick={() => onLocationSelect(location.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200
                         ${
                           selectedLocation === location.id
                             ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                             : "bg-background-card hover:bg-gray-100 dark:hover:bg-gray-800"
                         }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full mr-2
                                 ${
                                   selectedLocation === location.id
                                     ? "bg-primary-500 text-white"
                                     : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                 }`}
                  >
                    <span className="text-xs font-bold">{location.id}</span>
                  </div>
                  <h3 className="font-medium">{location.name}</h3>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  {eventCount > 0 && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                      {eventCount}
                    </span>
                  )}
                  {exhibitionCount > 0 && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                      {exhibitionCount}
                    </span>
                  )}
                  {foodStallCount > 0 && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      {foodStallCount}
                    </span>
                  )}
                </div>
              </button>

              {/* Location items */}
              {selectedLocation === location.id && filteredItems.length > 0 && (
                <div className="mt-2 ml-8 space-y-2">
                  {filteredItems.map((item) => (
                    <LocationCard
                      key={`${item.type}-${item.id}`}
                      item={item}
                      onClick={() => onItemClick(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationList;
