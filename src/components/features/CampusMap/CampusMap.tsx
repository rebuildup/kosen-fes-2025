// src/components/features/CampusMap/CampusMap.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Location } from "../../../types/location";
import styles from "./CampusMap.module.css";

interface CampusMapProps {
  locations: Location[];
  activeLocation: string | null;
  onLocationHover: (locationId: string | null) => void;
}

const CampusMap: React.FC<CampusMapProps> = ({
  locations,
  activeLocation,
  onLocationHover,
}) => {
  return (
    <div className={styles.mapWrapper}>
      <svg
        viewBox="0 0 800 600"
        className={styles.svgMap}
        aria-label="宇部高専祭キャンパスマップ"
      >
        {/* Base map elements - grounds, paths, etc. */}
        <rect width="800" height="600" fill="var(--color-bg-secondary)" />
        <path
          d="M100,100 L700,100 L700,500 L100,500 Z"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />

        {/* Paths */}
        <path
          d="M400,100 L400,500"
          stroke="var(--color-border-secondary)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M100,300 L700,300"
          stroke="var(--color-border-secondary)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Map locations */}
        {locations.map((location) => (
          <g
            key={location.id}
            className={`${styles.mapLocation} ${
              activeLocation === location.id ? styles.active : ""
            }`}
            onMouseEnter={() => onLocationHover(location.id)}
            onMouseLeave={() => onLocationHover(null)}
          >
            <Link to={`/detail/location/${location.id}`}>
              {/* Location shape based on type */}
              {location.shape === "rect" ? (
                <rect
                  x={location.x}
                  y={location.y}
                  width={location.width}
                  height={location.height}
                  fill={location.color}
                  rx="5"
                />
              ) : location.shape === "circle" ? (
                <circle
                  cx={location.x}
                  cy={location.y}
                  r={location.radius}
                  fill={location.color}
                />
              ) : (
                <polygon points={location.points} fill={location.color} />
              )}

              {/* Location label */}
              <text
                x={location.labelX || location.x}
                y={location.labelY || location.y}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                className={styles.locationLabel}
              >
                {location.name}
              </text>
            </Link>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CampusMap;
