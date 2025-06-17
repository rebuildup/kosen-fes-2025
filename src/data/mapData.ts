import { MapData, MapLocation } from "../types/data";

// Core map locations without content coupling
export const mapLocations: MapLocation[] = [
  {
    id: "main-stage",
    name: "メインステージ",
    centerX: 1000,
    centerY: 800,
    type: "landmark",
  },
  {
    id: "food-court",
    name: "フードコートエリア",
    centerX: 600,
    centerY: 750,
    type: "area",
  },
  {
    id: "main-entrance",
    name: "正門",
    centerX: 500,
    centerY: 400,
    type: "landmark",
  },
  {
    id: "_第二体育館",
    name: "第二体育館",
    centerX: 147.38,
    centerY: 188.82,
    polygon:
      "213.8533 275.8108 133.9082 275.8108 131.9095 283.8053 109.9246 283.8053 109.9246 273.8122 81.9438 273.8122 81.9438 251.8273 25.9822 249.8286 29.9794 103.9287 223.8465 107.926 213.8533 275.8108",
    type: "building",
    rooms: ["第二体育館", "武道場"],
  },
  {
    id: "F棟",
    name: "F棟",
    centerX: 1649.86,
    centerY: 805.44,
    polygon:
      "1754.7964 723.5038 1562.928 907.3776 1536.9458 883.3941 1728.8142 697.5216 1754.7964 723.5038",
    type: "building",
    rooms: ["教室F101", "教室F102"],
  },
  {
    id: "_経営情報学科棟",
    name: "経営情報学科棟",
    centerX: 883.39,
    centerY: 817.44,
    polygon:
      "831.4297 835.427 831.4297 795.4544 935.3585 799.4517 935.3585 805.4476 955.3447 807.4462 955.3447 839.4243 831.4297 835.427",
    type: "building",
    rooms: ["情報処理実習室", "経営学科事務室"],
  },
  {
    id: "_武道場",
    name: "武道場",
    centerX: 1160.24,
    centerY: 1087.2,
    polygon:
      "1187.1857 1169.1981 1131.2241 1165.2008 1129.2977 1008.296 1189.1844 1011.3064 1187.1857 1169.1981",
    type: "building",
    rooms: ["剣道場", "柔道場"],
  },
  {
    id: "_課外活動棟_",
    name: "課外活動棟",
    centerX: 1716.82,
    centerY: 882.39,
    polygon:
      "1824.7484 791.4572 1628.8828 973.3324 1608.8965 951.3475 1802.7635 767.4736 1824.7484 791.4572",
    type: "building",
    rooms: ["クラブハウス", "部室"],
  },
  {
    id: "_学生会館",
    name: "学生会館",
    centerX: 588.55,
    centerY: 733.5,
    polygon:
      "661.5463 791.4572 515.6463 785.4613 515.6463 675.5367 661.5463 675.5367 661.5463 791.4572",
    type: "building",
    rooms: ["学生ラウンジ", "売店", "食堂"],
  },
  {
    id: "_図書館棟",
    name: "図書館棟",
    centerX: 579.6,
    centerY: 497.66,
    polygon:
      "613.5792 365.7491 637.5627 365.7491 637.5627 415.7149 647.5559 415.7149 647.5559 451.6902 637.5627 451.6902 637.5627 499.6573 581.6011 499.6573 581.6011 545.6258 667.5421 545.6258 667.5421 629.5682 509.6504 629.5682 509.6504 535.6326 525.6395 535.6326 525.6395 497.6587 513.6477 497.6587 513.6477 359.7533 613.5792 361.7519 613.5792 365.7491",
    type: "building",
    rooms: ["図書館", "閲覧室", "情報検索室"],
  },
  {
    id: "_第一体育館",
    name: "第一体育館",
    centerX: 1007.76,
    centerY: 1088.25,
    polygon:
      "1077.2611 1197.1789 1069.2666 1197.1789 1065.2694 1227.1583 959.342 1225.1597 961.3406 1199.1775 953.3461 1199.1775 955.3447 979.3283 1081.2584 981.3269 1077.2611 1197.1789",
    type: "building",
    rooms: ["第一体育館", "バスケットコート"],
  },
  {
    id: "_管理棟",
    name: "管理棟",
    centerX: 248.83,
    centerY: 864.85,
    polygon:
      "267.8163 777.4668 263.8191 897.3845 387.7341 899.3831 387.7341 879.3968 433.7025 881.3955 431.7039 953.3461 63.9561 943.353 67.9534 893.3872 207.8574 895.3859 211.0996 776.0485 267.8163 777.4668",
    type: "building",
    rooms: ["事務室", "受付", "会議室"],
  },
  {
    id: "_機電棟",
    name: "機電棟",
    centerX: 254.83,
    centerY: 751.49,
    polygon:
      "439.6984 783.4626 267.8163 777.4668 211.0996 776.0485 69.952 771.4709 69.952 717.5079 439.6984 727.501 439.6984 783.4626",
    type: "building",
    rooms: ["機械工学科", "電気工学科"],
  },
];

// Map bounds and viewport configuration
export const mapBounds = {
  width: 1996.6306,
  height: 1343.0788,
  viewBox: "0 0 1996.6306 1343.0788",
};

// Combined map data
export const campusMapData: MapData = {
  locations: mapLocations,
  bounds: mapBounds,
};

// Helper functions for location mapping
export function getLocationByName(
  locationName: string
): MapLocation | undefined {
  return mapLocations.find(
    (location) =>
      locationName.includes(location.name) ||
      location.name.includes(locationName) ||
      location.rooms?.some((room) => locationName.includes(room))
  );
}

export function getLocationCoordinates(
  locationName: string
): { x: number; y: number } | undefined {
  const location = getLocationByName(locationName);
  if (location) {
    return { x: location.centerX, y: location.centerY };
  }

  // Enhanced fallback system with more precise coordinates
  const fallbacks = [
    {
      patterns: ["Main Stage", "メインステージ", "main-stage"],
      coords: { x: 333.3, y: 1060 },
    },
    {
      patterns: ["第二体育館", "second-gym"],
      coords: { x: 116.6, y: 183.1 },
    },
    {
      patterns: ["F棟", "F-building"],
      coords: { x: 1649.86, y: 805.44 },
    },
    {
      patterns: ["経営情報学科棟", "management-building"],
      coords: { x: 883.39, y: 817.44 },
    },
    {
      patterns: ["武道場", "martial-arts-hall"],
      coords: { x: 1160.24, y: 1087.2 },
    },
    {
      patterns: ["課外活動棟", "activity-building"],
      coords: { x: 1716.82, y: 882.39 },
    },
    {
      patterns: ["学生会館", "student-hall"],
      coords: { x: 588.55, y: 733.5 },
    },
    {
      patterns: ["図書館棟", "library"],
      coords: { x: 579.6, y: 497.66 },
    },
    {
      patterns: ["第一体育館", "first-gym"],
      coords: { x: 1007.76, y: 1088.25 },
    },
    {
      patterns: ["管理棟", "admin-building"],
      coords: { x: 248.83, y: 864.85 },
    },
    {
      patterns: ["機電棟", "engineering-building"],
      coords: { x: 244, y: 751 },
    },
  ];

  // Try exact match first
  for (const fallback of fallbacks) {
    if (
      fallback.patterns.some(
        (pattern) =>
          locationName.toLowerCase() === pattern.toLowerCase() ||
          locationName.includes(pattern) ||
          pattern.includes(locationName)
      )
    ) {
      return fallback.coords;
    }
  }

  // Try partial match with similarity scoring
  for (const fallback of fallbacks) {
    if (
      fallback.patterns.some((pattern) => {
        const similarity = calculateSimilarity(locationName, pattern);
        return similarity > 0.7; // 70% similarity threshold
      })
    ) {
      return fallback.coords;
    }
  }

  return undefined;
}

// Helper function to calculate string similarity
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance calculation
function getEditDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Additional utility functions for coordinate management
export function validateCoordinates(x: number, y: number): boolean {
  return x >= 0 && x <= mapBounds.width && y >= 0 && y <= mapBounds.height;
}

export function clampCoordinates(
  x: number,
  y: number
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(mapBounds.width, x)),
    y: Math.max(0, Math.min(mapBounds.height, y)),
  };
}

export function calculateDistance(
  coord1: { x: number; y: number },
  coord2: { x: number; y: number }
): number {
  const dx = coord1.x - coord2.x;
  const dy = coord1.y - coord2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function findNearestLocation(targetCoord: {
  x: number;
  y: number;
}): MapLocation | null {
  let nearestLocation: MapLocation | null = null;
  let shortestDistance = Infinity;

  for (const location of mapLocations) {
    const distance = calculateDistance(targetCoord, {
      x: location.centerX,
      y: location.centerY,
    });
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestLocation = location;
    }
  }

  return nearestLocation;
}
