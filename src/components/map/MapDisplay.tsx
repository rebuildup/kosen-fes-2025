import { useEffect, useRef, useState, useCallback } from "react";
import {
  getBuildingCoordinates,
  buildings,
  CAMPUS_MAP_BOUNDS,
} from "../../data/buildings";
import { useMapZoomPan } from "../../hooks/useMapZoomPan";
import ZoomControls from "./ZoomControls";

interface MapDisplayProps {
  hoveredLocation: string | null;
  selectedLocation: string | null;
  onLocationHover: (location: string | null) => void;
  onLocationSelect: (location: string | null) => void;
  locations: string[];
}

const MapDisplay = ({
  hoveredLocation,
  selectedLocation,
  onLocationHover,
  onLocationSelect,
  locations,
}: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [currentScale, setCurrentScale] = useState(1);

  // Initialize zoom/pan functionality
  const { svgRef, zoomPan, zoomIn, zoomOut, resetZoom, zoomToLocation } =
    useMapZoomPan({
      minScale: 0.5,
      maxScale: 5,
      initialScale: 1,
      mapWidth: CAMPUS_MAP_BOUNDS.width,
      mapHeight: CAMPUS_MAP_BOUNDS.height,
      containerRef: mapContainerRef,
      onTransformUpdate: useCallback((scale: number) => {
        setCurrentScale(scale);
      }, []),
    });

  // Calculate marker size based on actual current scale
  const getMarkerSize = (baseSize: number = 20) => {
    const scaledSize = baseSize / currentScale;
    return Math.max(8, Math.min(40, scaledSize));
  };

  // Calculate text size based on actual current scale
  const getTextSize = (baseSize: number = 12) => {
    const scaledSize = baseSize / currentScale;
    return Math.max(6, Math.min(18, scaledSize));
  };

  // Calculate stroke width based on actual current scale
  const getStrokeWidth = (baseWidth: number = 1) => {
    return baseWidth / currentScale;
  };

  // Get coordinates for each location using the building data
  const getLocationCoordinates = (
    location: string
  ): { x: number; y: number } | null => {
    const coords = getBuildingCoordinates(location);
    return coords || null;
  };

  // Handle location selection and hover
  useEffect(() => {
    if (selectedLocation) {
      const coords = getLocationCoordinates(selectedLocation);
      if (coords) {
        zoomToLocation(coords.x, coords.y, 4, 1.5);
      }
    }
  }, [selectedLocation, zoomToLocation]);

  useEffect(() => {
    if (hoveredLocation && !selectedLocation) {
      const coords = getLocationCoordinates(hoveredLocation);
      if (coords) {
        zoomToLocation(coords.x, coords.y, 4, 1);
      }
    }
  }, [hoveredLocation, selectedLocation, zoomToLocation]);

  // Reset zoom when no location is selected or hovered
  useEffect(() => {
    if (!hoveredLocation && !selectedLocation) {
      resetZoom();
    }
  }, [hoveredLocation, selectedLocation, resetZoom]);

  // Handle map SVG interactions
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Map container is now handling the accurate SVG map with zoom/pan
  }, [hoveredLocation, selectedLocation, locations]);

  return (
    <div ref={mapContainerRef} className="relative">
      <div>
        {/* Zoom Controls */}
        <ZoomControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetZoom}
          scale={zoomPan.scale}
          minScale={0.5}
          maxScale={5}
        />

        {/* Accurate Campus Map SVG */}
        <svg
          viewBox={CAMPUS_MAP_BOUNDS.viewBox}
          ref={svgRef}
          className="w-full h-auto"
        >
          <defs>
            <style>
              {`
                .cls-1 { fill: #b3b3b3; }
                .cls-2 { fill: gray; }
                .cls-3 { fill: #e6e6e6; }
                .building-interactive { 
                  cursor: pointer; 
                  transition: all 0.2s ease;
                  stroke-width: ${getStrokeWidth(1)};
                }
                .building-interactive:hover { 
                  fill: var(--primary-light) !important; 
                  opacity: 0.8;
                }
                .location-marker { 
                  cursor: pointer; 
                  transition: all 0.2s ease;
                }
                .location-marker.hovered .location-dot { 
                  r: ${getMarkerSize(25)}; 
                  fill: var(--primary-light);
                }
                .location-marker.selected .location-dot { 
                  r: ${getMarkerSize(30)}; 
                  fill: var(--primary);
                  filter: drop-shadow(0 0 10px var(--primary));
                }
                .location-label {
                  font-family: inherit;
                  font-size: ${getTextSize(12)}px;
                  font-weight: 500;
                  pointer-events: none;
                  text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
                }
              `}
            </style>
          </defs>

          {/* Base ground layer */}
          <g id="base">
            <polygon
              className="cls-3"
              points="709.5134 643.5586 769.4722 667.5421 813.4421 701.5188 835.427 731.4983 975.331 815.4407 1053.2776 809.4448 1079.2598 835.427 1067.268 849.4174 693.5243 835.427 695.523 759.4791 699.5202 637.5627 701.5188 621.5737 717.5079 543.6271 657.549 405.7217 645.5572 411.7176 689.5271 521.6422 695.523 549.623 683.5312 631.5668 679.5339 653.5517 675.5367 821.4366 673.538 831.4297 657.549 835.427 503.6546 831.4297 491.6628 825.4339 487.6655 805.4476 497.6587 321.7789 493.6614 313.7848 169.8835 305.7903 163.8876 309.7875 165.8862 325.7766 447.6929 337.7683 459.6847 349.7601 461.6833 451.6902 67.9534 441.697 69.952 395.7286 57.9602 391.7313 57.9602 365.7491 63.9561 309.7875 75.9479 301.793 77.9465 277.8095 35.9753 281.8067 31.9781 331.7724 37.974 463.682 25.9822 971.3338 13.9904 955.3447 5.9959 933.3598 9.9931 97.9328 9.9931 0 501.6559 0 569.6093 205.8588 725.5024 547.6244 709.5134 643.5586"
            />
            <polygon
              className="cls-3"
              points="459.6847 651.5531 447.6929 661.5463 67.9534 655.5504 65.9548 569.6093 73.9493 463.682 459.6847 477.6724 459.6847 651.5531"
            />
            <polygon
              className="cls-3"
              points="453.6888 961.3406 428.1581 976.6573 242.4325 971.3509 231.841 957.3434 197.8643 959.342 191.8684 969.3352 53.963 967.3365 49.9657 959.342 49.9657 835.427 55.9616 831.4297 59.9589 815.4407 65.9548 691.5257 77.9465 681.5326 169.8835 681.5326 249.8286 689.5271 375.7423 689.5271 445.6943 693.5243 455.6875 703.5175 449.6916 905.379 453.6888 961.3406"
            />
            <polygon
              className="cls-3"
              points="321.7793 1193.1816 315.7834 1193.1816 263.8191 1187.1857 21.9849 1185.1871 0 1169.1981 3.9973 1045.2831 7.9945 1021.2995 23.9836 1009.3077 159.7644 1011.3064 167.8849 1015.3036 171.8821 1023.2981 173.8807 1037.2885 251.8273 1039.2872 275.8108 1043.2844 275.8108 1115.2351 279.8081 1121.231 351.7587 1123.2296 357.7546 1125.2282 359.7533 1129.2255 355.756 1161.2036 337.7683 1173.1953 321.7793 1193.1816"
            />
            <polygon
              className="cls-3"
              points="907.3776 1161.2036 869.4037 1165.2008 695.523 1157.2063 525.6395 1157.2063 483.6683 1097.2474 485.6669 933.3598 491.6628 875.3996 499.6573 865.4064 547.6244 859.4105 727.501 871.4023 905.379 877.3982 911.3749 883.3941 907.3776 1161.2036"
            />
            <polygon
              className="cls-3"
              points="905.379 1289.1158 847.4188 1273.1268 489.6641 1213.1679 455.6875 1165.2008 421.7108 1165.2008 419.7121 1151.2104 437.6998 1149.2118 439.6984 1133.2227 475.6737 1133.2227 481.6696 1145.2145 507.6518 1177.1926 523.6408 1183.1885 881.3955 1201.1761 901.3818 1221.1624 907.3776 1229.1569 905.379 1289.1158"
            />
            <polygon
              className="cls-3"
              points="1099.2461 1245.146 959.342 1249.1432 943.353 1243.1474 941.3543 1065.2694 941.3543 913.3735 945.3516 905.379 953.3461 905.379 1087.2543 923.3667 1105.2419 939.3557 1099.2461 1245.146"
            />
            <polygon
              className="cls-3"
              points="1097.2474 1339.0816 1087.2543 1343.0788 965.3379 1303.1062 951.3475 1283.1199 955.3447 1275.1254 1123.2296 1269.1295 1125.2282 921.3681 1117.2337 905.379 989.3214 891.3886 985.3242 883.3941 991.3201 879.3968 1113.2365 877.3982 1301.1076 1083.257 1097.2474 1339.0816"
            />
            <polygon
              className="cls-3"
              points="1097.2474 773.4695 1131.2241 719.5065 1057.2748 571.6079 1247.1446 505.6532 1263.1336 497.6587 1377.0555 421.7108 1407.0349 407.7204 1520.9568 271.8136 1692.8389 525.6395 1996.6306 829.4311 1900.6964 831.4297 1682.8458 1055.2762 1696.8362 1071.2652 1568.9239 1257.1378 1363.0651 1043.2844 1311.1007 993.3187 1175.194 845.4201 1199.1775 823.4352 1211.1693 829.4311 1395.0432 1019.3009 1494.9746 929.3626 1504.9678 929.3626 1520.9568 941.3543 1658.8622 1085.2556 1678.8485 1059.2735 1588.9102 963.3393 1788.7731 761.4777 1776.7813 749.4859 1582.9143 937.3571 1568.9239 943.353 1554.9335 933.3598 1510.9637 889.39 1494.9746 891.3886 1470.9911 903.3804 1411.0322 957.3434 1377.0555 959.342 1193.1816 755.4818 1201.1761 709.5134 1295.1117 619.575 1297.1103 607.5833 1285.1186 587.597 1251.1419 547.6244 1231.1556 563.6134 1265.1323 611.5805 1263.1336 619.575 1179.1912 701.5188 1159.2049 791.4572 1141.2173 803.4489 1119.2323 793.4558 1097.2474 773.4695"
            />
          </g>

          {/* Roof/detail layer */}
          <g id="roof">
            <polygon
              className="cls-1"
              points="199.8629 797.453 79.9452 793.4558 79.9452 781.464 201.8615 783.4626 199.8629 797.453"
            />
            <polygon
              className="cls-1"
              points="191.8684 815.4407 77.9465 811.4434 77.9465 799.4517 193.867 801.4503 191.8684 815.4407"
            />
            <polygon
              className="cls-1"
              points="91.9369 867.4051 131.9095 869.4037 129.9109 881.3955 61.9575 879.3968 59.9589 845.4201 91.9369 849.4174 91.9369 867.4051"
            />
            <polygon
              className="cls-1"
              points="201.8615 833.4284 199.8629 879.3968 149.8972 877.3982 151.8958 857.4119 95.9342 853.4147 95.9342 839.4243 151.8958 841.4229 153.8944 831.4297 201.8615 833.4284"
            />
            <polygon
              className="cls-1"
              points="319.7807 817.4393 297.7957 817.4393 297.7957 797.453 319.6326 797.2852 319.7807 817.4393"
            />
            <polygon
              className="cls-1"
              points="743.4901 911.3749 583.5997 905.379 583.5997 885.3927 745.4887 889.39 743.4901 911.3749"
            />
            <polygon
              className="cls-1"
              points="731.4983 985.3242 631.5668 981.3269 631.5668 969.3352 733.4969 973.3324 731.4983 985.3242"
            />
            <polygon
              className="cls-1"
              points="851.416 987.3228 745.4887 985.3242 745.4887 971.3338 851.416 973.3324 851.416 987.3228"
            />
            <polygon
              className="cls-1"
              points="677.5353 1043.2844 641.56 1043.2844 641.56 1023.2981 661.5463 1023.2981 661.5463 1015.3036 679.5339 1015.3036 677.5353 1043.2844"
            />
            <polygon
              className="cls-1"
              points="625.5709 1027.2954 593.5929 1025.2968 593.5929 1015.3036 627.5696 1017.3023 625.5709 1027.2954"
            />
            <rect
              className="cls-1"
              x="565.6121"
              y="1011.3064"
              width="21.9849"
              height="19.9863"
            />
            <rect
              className="cls-1"
              x="535.6326"
              y="621.5737"
              width="31.9781"
              height="61.9575"
            />
            <polygon
              className="cls-1"
              points="1071.2652 985.3242 965.3379 985.3242 965.3379 949.3489 1071.2652 953.3461 1071.2652 985.3242"
            />
            <polygon
              className="cls-1"
              points="1133.2227 615.5778 1117.2337 597.5901 1129.2255 587.597 1145.2145 605.5846 1133.2227 615.5778"
            />
            <polygon
              className="cls-1"
              points="1115.2351 637.5627 1097.2474 617.5764 1107.2406 609.5819 1125.2282 627.5696 1115.2351 637.5627"
            />
            <polygon
              className="cls-1"
              points="1153.209 741.4914 1125.2282 767.4736 1113.2365 751.4846 1141.2173 727.501 1153.209 741.4914"
            />
            <polygon
              className="cls-1"
              points="1165.2008 765.475 1139.2186 791.4572 1125.2282 773.4695 1151.2104 749.4859 1165.2008 765.475"
            />
            <polygon
              className="cls-1"
              points="1163.2022 719.5065 1157.2063 723.5038 1153.209 715.5092 1159.2049 711.512 1163.2022 719.5065"
            />
            <polygon
              className="cls-1"
              points="1482.9829 487.6655 1464.9952 505.6532 1447.0075 485.6669 1464.9952 467.6792 1482.9829 487.6655"
            />
            <polygon
              className="cls-1"
              points="1494.9746 499.6573 1474.9883 517.645 1462.9966 503.6546 1480.9842 485.6669 1494.9746 499.6573"
            />
            <polygon
              className="cls-1"
              points="1508.965 505.6532 1484.9815 529.6367 1474.9883 517.645 1498.9719 493.6614 1508.965 505.6532"
            />
            <polygon
              className="cls-1"
              points="1560.9294 681.5326 1476.987 593.5929 1413.0308 651.5531 1401.0391 639.5613 1462.9966 579.6025 1405.0363 523.6408 1447.0075 483.6683 1488.9787 531.6354 1478.9856 541.6285 1488.9787 549.623 1476.987 561.6148 1576.9184 665.5435 1560.9294 681.5326"
            />
            <polygon
              className="cls-1"
              points="1614.8924 767.4736 1570.9225 813.4421 1560.9294 803.4489 1606.8979 759.4791 1614.8924 767.4736"
            />
            <polygon
              className="cls-1"
              points="1568.9239 819.438 1502.9691 883.3941 1492.976 871.4023 1558.9308 809.4448 1568.9239 819.438"
            />
            <polygon
              className="cls-1"
              points="1840.7375 849.4174 1672.8526 1013.305 1660.8609 1001.3132 1828.7457 835.427 1840.7375 849.4174"
            />
            <polygon
              className="cls-1"
              points="1768.7868 745.4887 1598.9033 913.3735 1592.9075 907.3776 1764.7896 739.4928 1768.7868 745.4887"
            />
            <polygon
              className="cls-1"
              points="1840.7375 751.4846 1772.7841 677.5353 1800.7649 653.5517 1866.7197 727.501 1840.7375 751.4846"
            />
            <polygon
              className="cls-1"
              points="1728.8142 641.56 1720.8197 631.5668 1732.8115 621.5737 1740.806 631.5668 1728.8142 641.56"
            />
            <rect
              className="cls-1"
              x="801.4503"
              y="737.4942"
              width="27.9808"
              height="67.9534"
            />
            <polygon
              className="cls-1"
              points="735.4955 809.4448 703.5175 809.4448 705.5161 747.4873 735.4955 747.4873 735.4955 809.4448"
            />
            <polygon
              className="cls-1"
              points="759.4791 719.5065 741.4914 719.5065 743.4901 677.5353 759.4791 679.5339 759.4791 719.5065"
            />
            <polygon
              className="cls-1"
              points="743.4901 1041.2858 687.5284 1039.2872 689.5271 1019.3009 743.4901 1021.2995 743.4901 1041.2858"
            />
            <polygon
              className="cls-1"
              points="797.453 1035.2899 765.475 1035.2899 767.4736 1015.3036 799.4517 1017.3023 797.453 1035.2899"
            />
            <polygon
              className="cls-1"
              points="895.3859 1037.2885 823.4352 1033.2913 823.4352 1019.3009 895.3859 1023.2981 895.3859 1037.2885"
            />
            <polygon
              className="cls-1"
              points="907.3776 977.3297 883.3941 977.3297 885.3927 889.39 908.5597 889.823 907.3776 977.3297"
            />
            <polygon
              className="cls-1"
              points="881.3955 937.3571 869.4037 937.3571 869.4037 889.39 883.3941 889.39 881.3955 937.3571"
            />
            <polygon
              className="cls-1"
              points="325.7766 885.3927 309.7875 885.3927 313.7848 867.4051 327.7752 869.4037 325.7766 885.3927"
            />
            <polygon
              className="cls-1"
              points="347.7615 883.3941 333.7711 883.3941 335.7697 869.4037 349.7601 871.4023 347.7615 883.3941"
            />
            <polygon
              className="cls-1"
              points="369.7464 885.3927 357.7546 885.3927 357.7546 869.4037 369.7464 871.4023 369.7464 885.3927"
            />
            <rect
              className="cls-1"
              x="423.7094"
              y="907.3776"
              width="93.9356"
              height="11.9918"
            />
            <polygon
              className="cls-1"
              points="217.8506 705.5161 157.8917 699.5202 159.8903 685.5298 219.8492 689.5271 217.8506 705.5161"
            />
            <polygon
              className="cls-1"
              points="321.7793 717.5079 265.8177 715.5092 267.8163 693.5243 321.7793 693.5243 321.7793 717.5079"
            />
            <rect
              className="cls-1"
              x="343.7642"
              y="695.523"
              width="53.963"
              height="21.9849"
            />
            <polygon
              className="cls-1"
              points="353.7574 1151.2104 321.7793 1149.2118 321.7793 1129.2255 353.7574 1131.2241 353.7574 1151.2104"
            />
          </g>

          {/* Building layer with interactive polygons */}
          <g id="building">
            {buildings.map((building) => (
              <polygon
                key={building.id}
                className="cls-2 building-interactive"
                points={building.polygon}
                style={{
                  strokeWidth: 1 / zoomPan.scale,
                }}
              >
                <title>{building.name}</title>
              </polygon>
            ))}
          </g>

          {/* Location markers for events, exhibits, and stalls - ズーム・パンに正しく追従 */}
          <g
            style={{
              transform: `scale(${zoomPan.scale}) translate(${
                zoomPan.x / zoomPan.scale
              }px, ${zoomPan.y / zoomPan.scale}px)`,
              transformOrigin: "0 0",
            }}
          >
            {locations.map((location) => {
              const coords = getLocationCoordinates(location);
              if (!coords) return null;

              const isHovered = hoveredLocation === location;
              const isSelected = selectedLocation === location;
              const markerSize = getMarkerSize(
                isSelected ? 30 : isHovered ? 25 : 20
              );
              const textSize = getTextSize(12);

              return (
                <g
                  key={location}
                  className={`location-marker ${isHovered ? "hovered" : ""} ${
                    isSelected ? "selected" : ""
                  }`}
                  onMouseEnter={() => onLocationHover(location)}
                  onMouseLeave={() => onLocationHover(null)}
                  onClick={() => onLocationSelect(location)}
                  style={{ cursor: "pointer" }}
                >
                  {/* ピンの影 */}
                  <circle
                    cx={coords.x + 2}
                    cy={coords.y + 2}
                    r={markerSize}
                    fill="rgba(0,0,0,0.2)"
                    opacity="0.5"
                  />

                  {/* メインマーカー */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={markerSize}
                    fill={
                      isSelected
                        ? "var(--primary)"
                        : isHovered
                        ? "var(--primary-light)"
                        : "var(--secondary)"
                    }
                    stroke="white"
                    strokeWidth={3 / zoomPan.scale}
                    className="location-dot"
                    style={{
                      filter: isSelected
                        ? "drop-shadow(0 0 10px var(--primary))"
                        : "none",
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* 内側のドット */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={markerSize * 0.3}
                    fill="white"
                  />

                  {/* ラベル */}
                  <text
                    x={coords.x}
                    y={coords.y - markerSize - 5}
                    textAnchor="middle"
                    fontSize={textSize}
                    fontWeight="500"
                    fill="var(--color-text-primary)"
                    stroke="white"
                    strokeWidth={2 / zoomPan.scale}
                    paintOrder="stroke"
                    className="location-label pointer-events-none"
                  >
                    {location.split(",")[0]}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <div>
          <div>
            <div></div>
            <span>Events</span>
          </div>
          <div>
            <div></div>
            <span>Exhibits</span>
          </div>
          <div>
            <div></div>
            <span>Stalls</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
