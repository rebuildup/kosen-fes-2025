import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { Location } from "../../../types/Location";

interface CampusMapProps {
  locations: Location[];
  selectedLocation: string | null;
  onLocationSelect: (locationId: string) => void;
  className?: string;
}

const CampusMap: React.FC<CampusMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  className = "",
}) => {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  // Update map size on resize
  useEffect(() => {
    const updateMapSize = () => {
      if (mapRef.current) {
        setMapSize({
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetWidth * 0.75, // 4:3 aspect ratio
        });
      }
    };

    // Initial size
    updateMapSize();

    // Add resize listener
    window.addEventListener("resize", updateMapSize);

    return () => {
      window.removeEventListener("resize", updateMapSize);
    };
  }, []);

  return (
    <div className={`campus-map ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{t("map.campusMap")}</h2>

      <div
        ref={mapRef}
        className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
        style={{ height: `${mapSize.height}px` }}
      >
        {/* Base campus map image */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* This would be replaced with the actual campus map image */}
          <div className="relative w-full h-full">
            <img
              src="/api/placeholder/1200/900/e5e7eb"
              alt={t("map.campusMap")}
              className="w-full h-full object-cover"
            />

            {/* Simulated building outlines */}
            <svg
              className="absolute inset-0"
              viewBox="0 0 1000 750"
              preserveAspectRatio="none"
            >
              {/* Main building */}
              <rect
                x="400"
                y="250"
                width="200"
                height="150"
                className="fill-white/20 stroke-gray-500 dark:stroke-gray-400 stroke-2"
              />

              {/* Engineering building */}
              <rect
                x="250"
                y="450"
                width="150"
                height="100"
                className="fill-white/20 stroke-gray-500 dark:stroke-gray-400 stroke-2"
              />

              {/* Science building */}
              <rect
                x="600"
                y="450"
                width="150"
                height="100"
                className="fill-white/20 stroke-gray-500 dark:stroke-gray-400 stroke-2"
              />

              {/* Gymnasium */}
              <rect
                x="150"
                y="200"
                width="180"
                height="120"
                className="fill-white/20 stroke-gray-500 dark:stroke-gray-400 stroke-2"
              />

              {/* Auditorium */}
              <rect
                x="700"
                y="200"
                width="180"
                height="120"
                className="fill-white/20 stroke-gray-500 dark:stroke-gray-400 stroke-2"
              />

              {/* Student Center */}
              <circle
                cx="500"
                cy="500"
                r="60"
                className="fill-white/20 stroke-gray-500 dark:stroke-gray-400 stroke-2"
              />
            </svg>
          </div>
        </div>

        {/* Location markers */}
        <div className="absolute inset-0">
          {locations.map((location) => {
            // Calculate position (would be based on actual coordinates in a real implementation)
            const positionX = (location.x / 10) * 100;
            const positionY = (location.y / 7.5) * 100;

            const isSelected = selectedLocation === location.id;

            return (
              <button
                key={location.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                         ${isSelected ? "scale-125 z-10" : "hover:scale-110"}`}
                style={{ left: `${positionX}%`, top: `${positionY}%` }}
                onClick={() => onLocationSelect(location.id)}
                aria-label={location.name}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full 
                                ${
                                  isSelected
                                    ? "bg-primary-500 text-white shadow-lg"
                                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-md"
                                }`}
                >
                  <span className="text-xs font-bold">{location.id}</span>
                </div>

                {/* Location name tooltip */}
                <div
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 
                               bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                               text-xs rounded shadow whitespace-nowrap
                               transition-opacity duration-200
                               ${
                                 isSelected
                                   ? "opacity-100"
                                   : "opacity-0 group-hover:opacity-100"
                               }`}
                >
                  {location.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 p-4 bg-background-card rounded-lg shadow-sm">
        <h3 className="text-sm font-medium mb-2">{t("map.legend")}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center">
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
              <span className="text-gray-700 dark:text-gray-300">
                {location.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
