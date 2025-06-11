import { useEffect, useRef } from "react";
import { getBuildingCoordinates, buildings, CAMPUS_MAP_BOUNDS } from "../../data/buildings";

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

  // Get coordinates for each location using the building data
  const getLocationCoordinates = (location: string): { x: number; y: number } | null => {
    const coords = getBuildingCoordinates(location);
    return coords || null;
  };

  // Handle map SVG interactions
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Map container is now handling the accurate SVG map
  }, [hoveredLocation, selectedLocation, locations]);

  return (
    <div className="map-display" ref={mapContainerRef}>
      <div className="school-map">
        {/* Accurate Campus Map SVG */}
        <svg viewBox={CAMPUS_MAP_BOUNDS.viewBox} className="school-map-svg">
          <defs>
            <style>
              {`
                .cls-1 { fill: #b3b3b3; }
                .cls-2 { fill: gray; }
                .cls-3 { fill: #e6e6e6; }
                .building-interactive { 
                  cursor: pointer; 
                  transition: all 0.2s ease;
                }
                .building-interactive:hover { 
                  fill: var(--primary-light) !important; 
                  opacity: 0.8;
                }
                .location-marker { 
                  cursor: pointer; 
                  transition: all 0.2s ease;
                }
                .location-marker.hovered circle { 
                  r: 25; 
                  fill: var(--primary-light);
                }
                .location-marker.selected circle { 
                  r: 30; 
                  fill: var(--primary);
                }
                .location-label {
                  font-family: inherit;
                  font-size: 24px;
                  font-weight: 500;
                  pointer-events: none;
                  text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
                }
              `}
            </style>
          </defs>
          
          {/* Base ground layer */}
          <g id="base">
            <polygon className="cls-3" points="988.5 1090.5 1018.5 1102.5 1040.5 1119.5 1051.5 1134.5 1121.5 1176.5 1160.5 1173.5 1173.5 1186.5 1167.5 1193.5 980.5 1186.5 981.5 1148.5 983.5 1087.5 984.5 1079.5 992.5 1040.5 962.5 971.5 956.5 974.5 978.5 1029.5 981.5 1043.5 975.5 1084.5 973.5 1095.5 971.5 1179.5 970.5 1184.5 962.5 1186.5 885.5 1184.5 879.5 1181.5 877.5 1171.5 882.5 929.4998 880.5 925.5 718.5 921.5 715.5 923.5 716.5 931.5 857.5 937.5 863.5 943.5 864.5 994.5 667.5 989.5 668.5 966.5 662.5 964.5 662.5 951.5 665.5 923.5 671.5 919.5 672.5 907.5 651.5 909.5 649.5 934.5 652.5 1000.5 646.5 1254.5 640.5 1246.5 636.5 1235.5 638.5 817.5 638.5 768.5 884.5 768.5 918.5 871.5 996.5 1042.5 988.5 1090.5"/>
            <polygon className="cls-3" points="863.5 1094.5 857.5 1099.5 667.5 1096.5 666.5 1053.5 670.5 1000.5 863.5 1007.5 863.5 1094.5"/>
            <polygon className="cls-3" points="860.5 1249.5 847.7259 1257.1636 754.7994 1254.5086 749.5 1247.5 732.5 1248.5 729.5 1253.5 660.5 1252.5 658.5 1248.5 658.5 1186.5 661.5 1184.5 663.5 1176.5 666.5 1114.5 672.5 1109.5 718.5 1109.5 758.5 1113.5 821.5 1113.5 856.5 1115.5 861.5 1120.5 858.5 1221.5 860.5 1249.5"/>
            <polygon className="cls-3" points="794.5 1365.5 791.5 1365.5 765.5 1362.5 644.5 1361.5 633.5 1353.5 635.5 1291.5 637.5 1279.5 645.5 1273.5 713.437 1274.5 717.5 1276.5 719.5 1280.5 720.5 1287.5 759.5 1288.5 771.5 1290.5 771.5 1326.5 773.5 1329.5 809.5 1330.5 812.5 1331.5 813.5 1333.5 811.5 1349.5 802.5 1355.5 794.5 1365.5"/>
            <polygon className="cls-3" points="1087.5 1349.5 1068.5 1351.5 981.5 1347.5 896.5 1347.5 875.5 1317.5 876.5 1235.5 879.5 1206.5 883.5 1201.5 907.5 1198.5 997.5 1204.5 1086.5 1207.5 1089.5 1210.5 1087.5 1349.5"/>
            <polygon className="cls-3" points="1086.5 1413.5 1057.5 1405.5 878.5 1375.5 861.5 1351.5 844.5 1351.5 843.5 1344.5 852.5 1343.5 853.5 1335.5 871.5 1335.5 874.5 1341.5 887.5 1357.5 895.5 1360.5 1074.5 1369.5 1084.5 1379.5 1087.5 1383.5 1086.5 1413.5"/>
            <polygon className="cls-3" points="1183.5 1391.5 1113.5 1393.5 1105.5 1390.5 1104.5 1301.5 1104.5 1225.5 1106.5 1221.5 1110.5 1221.5 1177.5 1230.5 1186.5 1238.5 1183.5 1391.5"/>
            <polygon className="cls-3" points="1182.5 1438.5 1177.5 1440.5 1116.5 1420.5 1109.5 1410.5 1111.5 1406.5 1195.5 1403.5 1196.5 1229.5 1192.5 1221.5 1128.5 1214.5 1126.5 1210.5 1129.5 1208.5 1190.5 1207.5 1284.5 1310.5 1182.5 1438.5"/>
            <polygon className="cls-3" points="1182.5 1155.5 1199.5 1128.5 1162.5 1054.5 1257.5 1021.5 1265.5 1017.5 1322.5 979.5 1337.5 972.5 1394.5 904.5 1480.5 1031.5 1632.5 1183.5 1584.5 1184.5 1475.5 1296.5 1482.5 1304.5 1418.5 1397.5 1315.5 1290.5 1289.5 1265.5 1221.5 1191.5 1233.5 1180.5 1239.5 1183.5 1331.5 1278.5 1381.5 1233.5 1386.5 1233.5 1394.5 1239.5 1463.5 1311.5 1473.5 1298.5 1428.5 1250.5 1528.5 1149.5 1522.5 1143.5 1425.5 1237.5 1418.5 1240.5 1411.5 1235.5 1389.5 1213.5 1381.5 1214.5 1369.5 1220.5 1339.5 1247.5 1322.5 1248.5 1230.5 1146.5 1234.5 1123.5 1281.5 1078.5 1282.5 1072.5 1276.5 1062.5 1259.5 1042.5 1249.5 1050.5 1266.5 1074.5 1265.5 1078.5 1223.5 1119.5 1213.5 1164.5 1204.5 1170.5 1193.5 1165.5 1182.5 1155.5"/>
          </g>
          
          {/* Roof/detail layer */}
          <g id="yane">
            <polygon className="cls-1" points="733.5 1167.5 673.5 1165.5 673.5 1159.5 734.5 1160.5 733.5 1167.5"/>
            <polygon className="cls-1" points="729.5 1176.5 672.5 1174.5 672.5 1168.5 730.5 1169.5 729.5 1176.5"/>
            <polygon className="cls-1" points="679.5 1202.5 699.5 1203.5 698.5 1209.5 664.5 1208.5 663.5 1191.5 679.5 1193.5 679.5 1202.5"/>
            <polygon className="cls-1" points="734.5 1185.5 733.5 1208.5 708.5 1207.5 709.5 1197.5 681.5 1195.5 681.5 1188.5 709.5 1189.5 710.5 1184.5 734.5 1185.5"/>
            <polygon className="cls-1" points="793.5 1177.5 782.5 1177.5 782.5 1167.5 793.4259 1167.416 793.5 1177.5"/>
            <polygon className="cls-1" points="1005.5 1224.5 925.5 1221.5 925.5 1211.5 1006.5 1213.5 1005.5 1224.5"/>
            <polygon className="cls-1" points="999.5 1261.5 949.5 1259.5 949.5 1253.5 1000.5 1255.5 999.5 1261.5"/>
            <polygon className="cls-1" points="1059.5 1262.5 1006.5 1261.5 1006.5 1254.5 1059.5 1255.5 1059.5 1262.5"/>
            <polygon className="cls-1" points="972.5 1290.5 954.5 1290.5 954.5 1280.5 964.5 1280.5 964.5 1276.5 973.5 1276.5 972.5 1290.5"/>
            <polygon className="cls-1" points="946.5 1282.5 930.5 1281.5 930.5 1276.5 947.5 1277.5 946.5 1282.5"/>
            <rect className="cls-1" x="916.5" y="1274.5" width="11" height="10"/>
            <rect className="cls-1" x="901.5" y="1079.5" width="16" height="31"/>
            <polygon className="cls-1" points="1169.5 1261.5 1116.5 1261.5 1116.5 1243.5 1169.5 1245.5 1169.5 1261.5"/>
            <polygon className="cls-1" points="1200.5 1076.5 1192.5 1067.5 1198.5 1062.5 1206.5 1071.5 1200.5 1076.5"/>
            <polygon className="cls-1" points="1191.5 1087.5 1182.5 1077.5 1187.5 1073.5 1196.5 1082.5 1191.5 1087.5"/>
            <polygon className="cls-1" points="1210.5 1139.5 1196.5 1152.5 1190.5 1144.5 1204.5 1132.5 1210.5 1139.5"/>
            <polygon className="cls-1" points="1216.5 1151.5 1203.5 1164.5 1196.5 1155.5 1209.5 1143.5 1216.5 1151.5"/>
            <polygon className="cls-1" points="1215.5 1128.5 1212.5 1130.5 1210.5 1126.5 1213.5 1124.5 1215.5 1128.5"/>
            <polygon className="cls-1" points="1375.5 1012.5 1366.5 1021.5 1357.5 1011.5 1366.5 1002.5 1375.5 1012.5"/>
            <polygon className="cls-1" points="1381.5 1018.5 1371.5 1027.5 1365.5 1020.5 1374.5 1011.5 1381.5 1018.5"/>
            <polygon className="cls-1" points="1388.5 1021.5 1376.5 1033.5 1371.5 1027.5 1383.5 1015.5 1388.5 1021.5"/>
            <polygon className="cls-1" points="1414.5 1109.5 1372.5 1065.5 1340.5 1094.5 1334.5 1088.5 1365.5 1058.5 1336.5 1030.5 1357.5 1010.5 1378.5 1034.5 1373.5 1039.5 1378.5 1043.5 1372.5 1049.5 1422.5 1101.5 1414.5 1109.5"/>
            <polygon className="cls-1" points="1441.5 1152.5 1419.5 1175.5 1414.5 1170.5 1437.5 1148.5 1441.5 1152.5"/>
            <polygon className="cls-1" points="1418.5 1178.5 1385.5 1210.5 1380.5 1204.5 1413.5 1173.5 1418.5 1178.5"/>
            <polygon className="cls-1" points="1554.5 1193.5 1470.5 1275.5 1464.5 1269.5 1548.5 1186.5 1554.5 1193.5"/>
            <polygon className="cls-1" points="1518.5 1141.5 1433.5 1225.5 1430.5 1222.5 1516.5 1138.5 1518.5 1141.5"/>
            <polygon className="cls-1" points="1554.5 1144.5 1520.5 1107.5 1534.5 1095.5 1567.5 1132.5 1554.5 1144.5"/>
            <polygon className="cls-1" points="1498.5 1089.5 1494.5 1084.5 1500.5 1079.5 1504.5 1084.5 1498.5 1089.5"/>
            <rect className="cls-1" x="1034.5" y="1137.5" width="14" height="34"/>
            <polygon className="cls-1" points="1001.5 1173.5 985.5 1173.5 986.5 1142.5 1001.5 1142.5 1001.5 1173.5"/>
            <polygon className="cls-1" points="1013.5 1128.5 1004.5 1128.5 1005.5 1107.5 1013.5 1108.5 1013.5 1128.5"/>
            <polygon className="cls-1" points="1005.5 1289.5 977.5 1288.5 978.5 1278.5 1005.5 1279.5 1005.5 1289.5"/>
            <polygon className="cls-1" points="1032.5 1286.5 1016.5 1286.5 1017.5 1276.5 1033.5 1277.5 1032.5 1286.5"/>
            <polygon className="cls-1" points="1081.5 1287.5 1045.5 1285.5 1045.5 1278.5 1081.5 1280.5 1081.5 1287.5"/>
            <polygon className="cls-1" points="1087.5 1257.5 1075.5 1257.5 1076.5 1213.5 1088.0914 1213.7167 1087.5 1257.5"/>
            <polygon className="cls-1" points="1074.5 1237.5 1068.5 1237.5 1068.5 1213.5 1075.5 1213.5 1074.5 1237.5"/>
            <polygon className="cls-1" points="796.5 1211.5 788.5 1211.5 790.5 1202.5 797.5 1203.5 796.5 1211.5"/>
            <polygon className="cls-1" points="807.5 1210.5 800.5 1210.5 801.5 1203.5 808.5 1204.5 807.5 1210.5"/>
            <polygon className="cls-1" points="818.5 1211.5 812.5 1211.5 812.5 1203.5 818.5 1204.5 818.5 1211.5"/>
            <rect className="cls-1" x="845.5" y="1222.5" width="47" height="6"/>
            <polygon className="cls-1" points="742.5 1121.5 712.5 1118.5 713.5 1111.5 743.5 1113.5 742.5 1121.5"/>
            <polygon className="cls-1" points="794.5 1127.5 766.5 1126.5 767.5 1115.5 794.5 1115.5 794.5 1127.5"/>
            <rect className="cls-1" x="805.5" y="1116.5" width="27" height="11"/>
            <polygon className="cls-1" points="810.5 1344.5 794.5 1343.5 794.5 1333.5 810.5 1334.5 810.5 1344.5"/>
          </g>
          
          {/* Building layer with interactive polygons */}
          <g id="tatemono">
            {buildings.map((building) => (
              <polygon
                key={building.id}
                className="cls-2 building-interactive"
                points={building.polygon}
                title={building.name}
              />
            ))}
          </g>

          {/* Location markers for events, exhibits, and stalls */}
          {locations.map((location) => {
            const coords = getLocationCoordinates(location);
            if (!coords) return null;

            return (
              <g
                key={location}
                className={`location-marker ${
                  hoveredLocation === location ? "hovered" : ""
                } ${selectedLocation === location ? "selected" : ""}`}
                onMouseEnter={() => onLocationHover(location)}
                onMouseLeave={() => onLocationHover(null)}
                onClick={() => onLocationSelect(location)}
              >
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={
                    selectedLocation === location
                      ? 30
                      : hoveredLocation === location
                      ? 25
                      : 20
                  }
                  fill={
                    selectedLocation === location
                      ? "var(--primary)"
                      : hoveredLocation === location
                      ? "var(--primary-light)"
                      : "var(--secondary)"
                  }
                  stroke="white"
                  strokeWidth="3"
                  className="location-dot"
                />
                <text
                  x={coords.x}
                  y={coords.y + 8}
                  textAnchor="middle"
                  className="location-label"
                  fill="var(--text-primary)"
                >
                  {location.split(",")[0]}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-dot event-dot"></div>
            <span>Events</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot exhibit-dot"></div>
            <span>Exhibits</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot stall-dot"></div>
            <span>Stalls</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
