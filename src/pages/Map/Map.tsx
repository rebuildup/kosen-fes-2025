// src/pages/Map/Map.tsx
import React, { useState } from "react";
import CampusMap from "../../components/features/CampusMap/CampusMap";
import LocationCard from "../../components/features/LocationCard/LocationCard";
import { useLocations } from "../../hooks/useLocations";
import styles from "./Map.module.css";

const Map: React.FC = () => {
  const { locations, loading } = useLocations();
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const handleLocationHover = (locationId: string | null) => {
    setActiveLocation(locationId);
  };

  return (
    <div className={styles.mapPage}>
      <h1 className={styles.pageTitle}>キャンパスマップ</h1>

      <div className={styles.mapContent}>
        <div className={styles.mapContainer}>
          {loading ? (
            <div className={styles.loading}>マップ読み込み中...</div>
          ) : (
            <CampusMap
              locations={locations}
              activeLocation={activeLocation}
              onLocationHover={handleLocationHover}
            />
          )}
        </div>

        <div className={styles.locationsContainer}>
          <h2 className={styles.locationsTitle}>会場一覧</h2>

          {loading ? (
            <div className={styles.loading}>読み込み中...</div>
          ) : (
            <div className={styles.locationsList}>
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  isActive={activeLocation === location.id}
                  onHover={() => handleLocationHover(location.id)}
                  onLeave={() => handleLocationHover(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
