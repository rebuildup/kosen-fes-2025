import { useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface DetailMapProps {
  location: string;
}

const DetailMap = ({ location }: DetailMapProps) => {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);

  // Map location names to coordinates on the SVG map
  // This would be replaced with actual mapping data in a real implementation
  const locationCoordinates: Record<string, { x: number; y: number }> = {
    "Main Stage": { x: 50, y: 30 },
    "Engineering Building": { x: 25, y: 50 },
    "Science Building": { x: 75, y: 50 },
    "Art Building, Gallery Hall": { x: 40, y: 70 },
    "Architecture Building, Room 101": { x: 60, y: 70 },
    "Engineering Building, Room 203": { x: 25, y: 60 },
    "Science Building, Chemistry Lab": { x: 75, y: 60 },
    "Library, Exhibition Hall": { x: 50, y: 80 },
    "Computer Science Building, Lab 105": { x: 80, y: 30 },
    "Food Court Area, Stall 1": { x: 30, y: 20 },
    "Food Court Area, Stall 2": { x: 35, y: 20 },
    "Food Court Area, Stall 5": { x: 40, y: 20 },
    "Central Plaza, Stall 3": { x: 50, y: 50 },
    "Central Plaza, Stall 4": { x: 55, y: 50 },
    "Main Entrance": { x: 50, y: 10 },
  };

  const coords = locationCoordinates[location] || { x: 50, y: 50 };

  return (
    <div className="detail-map" ref={mapRef}>
      <div className="detail-map-container">
        <svg viewBox="0 0 100 100" className="detail-map-svg">
          {/* Background elements */}
          <rect x="0" y="0" width="100" height="100" fill="#f0f0f0" />
          <path
            d="M10,10 L90,10 L90,90 L10,90 Z"
            fill="#ffffff"
            stroke="#dddddd"
          />
          {/* Buildings and areas */}
          <rect
            x="45"
            y="5"
            width="10"
            height="10"
            fill="#dddddd"
            stroke="#aaaaaa"
          />{" "}
          {/* Main Entrance */}
          <rect
            x="40"
            y="25"
            width="20"
            height="10"
            fill="#ffcccc"
            stroke="#ff9999"
          />{" "}
          {/* Main Stage */}
          <rect
            x="20"
            y="45"
            width="15"
            height="20"
            fill="#ccffcc"
            stroke="#99ff99"
          />{" "}
          {/* Engineering Building */}
          <rect
            x="70"
            y="45"
            width="15"
            height="20"
            fill="#ccccff"
            stroke="#9999ff"
          />{" "}
          {/* Science Building */}
          <rect
            x="35"
            y="65"
            width="10"
            height="10"
            fill="#ffffcc"
            stroke="#ffff99"
          />{" "}
          {/* Art Building */}
          <rect
            x="55"
            y="65"
            width="10"
            height="10"
            fill="#ffccff"
            stroke="#ff99ff"
          />{" "}
          {/* Architecture Building */}
          <rect
            x="45"
            y="75"
            width="10"
            height="10"
            fill="#ccffff"
            stroke="#99ffff"
          />{" "}
          {/* Library */}
          <rect
            x="75"
            y="25"
            width="10"
            height="10"
            fill="#ffddcc"
            stroke="#ffbb99"
          />{" "}
          {/* Computer Science Building */}
          <rect
            x="25"
            y="15"
            width="25"
            height="10"
            fill="#ddffcc"
            stroke="#bbff99"
          />{" "}
          {/* Food Court Area */}
          <ellipse
            cx="50"
            cy="50"
            rx="10"
            ry="5"
            fill="#ddddff"
            stroke="#bbbbff"
          />{" "}
          {/* Central Plaza */}
          {/* Location marker for this location */}
          <circle
            cx={coords.x}
            cy={coords.y}
            r={5}
            fill="var(--primary)"
            stroke="white"
            strokeWidth="2"
            className="location-highlight"
          >
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.8;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={coords.x}
            y={coords.y - 8}
            textAnchor="middle"
            fontSize="3"
            fontWeight="bold"
            fill="var(--primary)"
            stroke="white"
            strokeWidth="0.5"
            className="location-name"
          >
            {location.split(",")[0]}
          </text>
        </svg>
      </div>

      <div className="detail-map-footer">
        <Link to="/map" className="view-full-map-button">
          {t("map.viewFullMap")} →
        </Link>
      </div>
    </div>
  );
};

export default DetailMap;
