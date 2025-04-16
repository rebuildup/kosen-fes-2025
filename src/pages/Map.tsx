// src/pages/Map.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Map.css";

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".map-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      });

      gsap.from(".location-item", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.5,
        ease: "power2.out",
      });
    }, mapRef);

    return () => ctx.revert();
  }, []);

  // src/pages/Map.tsx (continued)
  const locations = [
    {
      id: 1,
      name: "Main Stage",
      description: "Major performances and ceremonies",
      color: "#f44336",
    },
    {
      id: 2,
      name: "Performance Hall",
      description: "Dance and theatrical performances",
      color: "#2196f3",
    },
    {
      id: 3,
      name: "Art Studios",
      description: "Workshops and interactive exhibits",
      color: "#4caf50",
    },
    {
      id: 4,
      name: "Food Court",
      description: "International cuisine and food stalls",
      color: "#ff9800",
    },
    {
      id: 5,
      name: "Theater",
      description: "Film screenings and presentations",
      color: "#9c27b0",
    },
    {
      id: 6,
      name: "Conference Room",
      description: "Talks and panel discussions",
      color: "#607d8b",
    },
    {
      id: 7,
      name: "Garden Area",
      description: "Outdoor activities and relaxation",
      color: "#009688",
    },
    {
      id: 8,
      name: "Main Entrance",
      description: "Information desk and registration",
      color: "#795548",
    },
  ];

  return (
    <div className="map-container" ref={mapRef}>
      <h1 className="page-title">Festival Map</h1>

      <div className="map-content">
        <div className="festival-map">
          <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect width="800" height="600" fill="#f8f8f8" />

            {/* Paths/Roads */}
            <path
              d="M100,300 L700,300"
              stroke="#ddd"
              strokeWidth="30"
              strokeLinecap="round"
            />
            <path
              d="M400,100 L400,500"
              stroke="#ddd"
              strokeWidth="30"
              strokeLinecap="round"
            />

            {/* Main Stage */}
            <rect
              x="500"
              y="120"
              width="180"
              height="100"
              fill={locations[0].color}
              rx="10"
            />
            <text
              x="590"
              y="170"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              Main Stage
            </text>

            {/* Performance Hall */}
            <rect
              x="500"
              y="380"
              width="180"
              height="100"
              fill={locations[1].color}
              rx="10"
            />
            <text
              x="590"
              y="430"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              Performance Hall
            </text>

            {/* Art Studios */}
            <rect
              x="120"
              y="120"
              width="180"
              height="100"
              fill={locations[2].color}
              rx="10"
            />
            <text
              x="210"
              y="170"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              Art Studios
            </text>

            {/* Food Court */}
            <rect
              x="120"
              y="380"
              width="180"
              height="100"
              fill={locations[3].color}
              rx="10"
            />
            <text
              x="210"
              y="430"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              Food Court
            </text>

            {/* Theater */}
            <circle cx="400" cy="180" r="60" fill={locations[4].color} />
            <text
              x="400"
              y="180"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              Theater
            </text>

            {/* Conference Room */}
            <circle cx="400" cy="420" r="60" fill={locations[5].color} />
            <text
              x="400"
              y="420"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              Conference Room
            </text>

            {/* Garden Area */}
            <path
              d="M650,510 Q750,450 750,550 Q650,600 650,510 Z"
              fill={locations[6].color}
            />
            <text
              x="700"
              y="550"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              Garden
            </text>

            {/* Main Entrance */}
            <path d="M50,300 L10,270 L10,330 Z" fill={locations[7].color} />
            <text
              x="60"
              y="300"
              fill="white"
              textAnchor="start"
              fontWeight="bold"
              fontSize="14"
            >
              Entrance
            </text>

            {/* Trees and decorations */}
            <circle cx="100" cy="100" r="10" fill="#4caf50" />
            <circle cx="150" cy="70" r="8" fill="#4caf50" />
            <circle cx="700" cy="100" r="10" fill="#4caf50" />
            <circle cx="650" cy="70" r="8" fill="#4caf50" />
            <circle cx="700" cy="500" r="10" fill="#4caf50" />
            <circle cx="100" cy="500" r="10" fill="#4caf50" />
            <circle cx="150" cy="530" r="8" fill="#4caf50" />
          </svg>
        </div>

        <div className="location-list">
          <h2>Venue Locations</h2>
          <ul className="locations">
            {locations.map((location) => (
              <li key={location.id} className="location-item">
                <span
                  className="location-color"
                  style={{ backgroundColor: location.color }}
                ></span>
                <div className="location-info">
                  <h3>{location.name}</h3>
                  <p>{location.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Map;
