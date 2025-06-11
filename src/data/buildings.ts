// Building data extracted from the accurate campus map SVG
// Each building corresponds to a polygon in the id="tatemono" group

export interface Building {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  polygon: string;
  rooms?: string[];
}

// Calculate polygon center from points string
function calculatePolygonCenter(points: string): { x: number; y: number } {
  const coords = points.split(' ').map(Number);
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  
  for (let i = 0; i < coords.length; i += 2) {
    if (!isNaN(coords[i]) && !isNaN(coords[i + 1])) {
      sumX += coords[i];
      sumY += coords[i + 1];
      count++;
    }
  }
  
  return {
    x: sumX / count,
    y: sumY / count
  };
}

// Building data based on SVG polygon analysis
const buildingPolygons = [
  {
    id: "building-1",
    name: "第1校舎",
    points: "740.5 906.5 700.5 906.5 699.5 910.5 688.5 910.5 688.5 905.5 674.5 905.5 674.5 894.5 646.5 893.5 648.5 820.5 745.5 822.5 740.5 906.5",
    rooms: ["Room 101", "Room 102", "Room 103"]
  },
  {
    id: "building-2", 
    name: "工学部棟",
    points: "777.5 986.5 670.5 981.5 670.5 962.8473 664.5 961.5 665.5 953.5 670.5 953.5 672.5 921.5 691.5 922.5 691.5 929.5 711.5 929.5 711.5 936.5 778.5 941.5 777.5 986.5",
    rooms: ["Room 203", "Lab A", "Lab B"]
  },
  {
    id: "building-3",
    name: "理学部棟", 
    points: "857.5 992.5 783.5 989.5 784.5 973.5 780.5 972.5 781.5 944.5 859.5 947.5 857.5 992.5",
    rooms: ["Chemistry Lab", "Physics Lab"]
  },
  {
    id: "building-4",
    name: "図書館",
    points: "787.5 1090.5 669.5 1087.5 674.5 1012.5 788.5 1016.5 788.0134 1052.5089 846.5 1054.5 846.5 1089.5 787.5358 1087.8528 787.5 1090.5",
    rooms: ["Exhibition Hall", "Reading Room"]
  },
  {
    id: "building-5",
    name: "メインホール",
    points: "853.5 1160.5 767.5 1157.5 765.5 1217.5 827.5 1218.5 827.5 1208.5 850.5 1209.5 849.5 1245.5 665.5 1240.5 667.5 1215.5 737.5 1216.5 739.1222 1156.7904 668.5 1154.5 668.5 1127.5 853.5 1132.5 853.5 1160.5",
    rooms: ["Main Hall", "Conference Room"]
  },
  {
    id: "building-6",
    name: "学生会館",
    points: "710.5 1335.5 662.5 1336.5 663.5 1292.5 755.5 1295.5 754.5 1335.5 719.5 1334.5 718.5 1329.5 710.5 1329.5 710.5 1335.5",
    rooms: ["Student Lounge", "Meeting Room"]
  },
  {
    id: "building-7",
    name: "建築学科棟",
    points: "1042.5 1343.5 899.5 1339.5 898.5 1297.5 908.5 1297.5 908.5 1299.5 929.5 1300.5 931.5 1295.5 1077.5 1303.5 1076.5 1343.5 1051.5 1343.5 1042.5 1343.5",
    rooms: ["Room 101", "Design Studio"]
  },
  {
    id: "building-8",
    name: "研究室棟A",
    points: "1060.5 1250.5 908.5 1246.5 907.5 1249.5 889.5 1248.5 890.5 1213.5 910.5 1214.5 911.5 1221.5 1061.5 1227.5 1060.5 1250.5",
    rooms: ["Research Lab 1", "Research Lab 2"]
  },
  {
    id: "building-9",
    name: "研究室棟B", 
    points: "964.5 1164.5 891.5 1161.5 891.5 1106.5 964.5 1106.5 964.5 1164.5",
    rooms: ["Lab 301", "Lab 302"]
  },
  {
    id: "building-10",
    name: "情報工学科棟",
    points: "940.5 951.5 952.5 951.5 952.5 976.5 957.5 976.5 957.5 994.5 952.5 994.5 952.5 1018.5 924.5 1018.5 924.5 1041.5 967.5 1041.5 967.5 1083.5 888.5 1083.5 888.5 1036.5 896.5 1036.5 896.5 1017.5 890.5 1017.5 890.5 948.5 940.5 949.5 940.5 951.5",
    rooms: ["Lab 105", "Computer Lab"]
  },
  {
    id: "building-11",
    name: "管理棟",
    points: "1172.5 1367.5 1168.5 1367.5 1166.5 1382.5 1113.5 1381.5 1114.5 1368.5 1110.5 1368.5 1111.5 1258.5 1174.5 1259.5 1172.5 1367.5",
    rooms: ["Admin Office", "Reception"]
  },
  {
    id: "building-12",
    name: "第2校舎",
    points: "1049.5 1186.5 1049.5 1166.5 1101.5 1168.5 1101.5 1171.5 1111.5 1172.5 1111.5 1188.5 1049.5 1186.5",
    rooms: ["Classroom 201", "Classroom 202"]
  },
  {
    id: "building-13",
    name: "体育館",
    points: "1030.5 1170.5 1003.5 1170.5 1004.5 1127.5 1031.5 1128.5 1030.5 1170.5",
    rooms: ["Gymnasium", "Sports Hall"]
  }
];

export const buildings: Building[] = buildingPolygons.map(building => {
  const center = calculatePolygonCenter(building.points);
  return {
    id: building.id,
    name: building.name,
    centerX: center.x,
    centerY: center.y,
    polygon: building.points,
    rooms: building.rooms
  };
});

// Campus map dimensions from SVG viewBox
export const CAMPUS_MAP_BOUNDS = {
  width: 2142.031,
  height: 1901.9258,
  viewBox: "0 0 2142.031 1901.9258"
};

// Helper function to get building by name or partial name match
export function getBuildingByName(locationName: string): Building | undefined {
  return buildings.find(building => 
    locationName.includes(building.name) ||
    building.rooms?.some(room => locationName.includes(room))
  );
}

// Helper function to get building coordinates for a location string
export function getBuildingCoordinates(locationName: string): { x: number; y: number } | undefined {
  const building = getBuildingByName(locationName);
  if (building) {
    return { x: building.centerX, y: building.centerY };
  }
  
  // Fallback for common location patterns
  if (locationName.includes("Main Stage") || locationName.includes("メインステージ")) {
    return { x: 1071, y: 1150 }; // Central area
  }
  if (locationName.includes("Central Plaza") || locationName.includes("中央広場")) {
    return { x: 900, y: 1200 }; // Central plaza area  
  }
  if (locationName.includes("Food Court") || locationName.includes("フードコート")) {
    return { x: 750, y: 1300 }; // Food court area
  }
  if (locationName.includes("Main Entrance") || locationName.includes("正門")) {
    return { x: 1071, y: 600 }; // Main entrance area
  }
  
  return undefined;
}