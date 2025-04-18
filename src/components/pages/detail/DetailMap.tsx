import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { locations } from "../../../data/locations";

interface DetailMapProps {
  location: string;
  locationInfo?: any;
  className?: string;
}

const DetailMap: React.FC<DetailMapProps> = ({
  location,
  locationInfo,
  className = "",
}) => {
  const { t } = useLanguage();
  const [aspectRatio, setAspectRatio] = useState({ width: 0, height: 0 });

  // Find the location in the locations array if not provided
  const locationData =
    locationInfo || locations.find((loc) => loc.name === location);

  // Set map aspect ratio
  useEffect(() => {
    setAspectRatio({
      width: 1000,
      height: 750,
    });
  }, []);

  return (
    <div className={`detail-map ${className}`}>
      <div className="bg-background-card rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          {/* Location info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{location}</h3>
            {locationData && locationData.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {locationData.description}
              </p>
            )}
          </div>

          {/* Map */}
          <div
            className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
            style={{ height: "400px" }}
          >
            {/* This would be replaced with the actual campus map image */}
            <div className="relative w-full h-full">
              <img
                src="/api/placeholder/1200/900/e5e7eb"
                alt={t("map.campusMap")}
                className="w-full h-full object-cover"
              />

              {/* Location marker */}
              {locationData && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(locationData.x / aspectRatio.width) * 100}%`,
                    top: `${(locationData.y / aspectRatio.height) * 100}%`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-primary-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg mb-1 animate-pulse">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded shadow-md text-xs font-medium">
                      {location}
                    </div>
                  </div>
                </div>
              )}

              {/* Simulated building outlines - similar to CampusMap component */}
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
        </div>
      </div>
    </div>
  );
};

export default DetailMap;
