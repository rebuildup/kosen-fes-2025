// src/components/map/LocationList.tsx
import { useLanguage } from "../../context/LanguageContext";
import { Event, Exhibit, Stall } from "../../types/common";
import LocationItem from "./LocationItem";

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
    <div className="location-list">
      <h2 className="location-list-title">{t("map.viewLocations")}</h2>

      {sortedLocations.length === 0 ? (
        <div className="location-list-empty">{t("map.noLocations")}</div>
      ) : (
        <div className="location-items">
          {sortedLocations.map((location) => (
            <LocationItem
              key={location}
              location={location}
              items={getItemsForLocation(location)}
              isHovered={hoveredLocation === location}
              isSelected={selectedLocation === location}
              onHover={onLocationHover}
              onSelect={onLocationSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationList;