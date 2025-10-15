export type Amenity = {
  id: string;
  type: "toilet" | "trash" | "water" | "info";
  name?: string;
  x: number; // normalized coordinates (0-1) or map-specific units
  y: number;
};

// Sample positions — adjust to real map coordinates as needed
const amenities: Amenity[] = [
  { id: "toilet-1", name: "男子トイレ", type: "toilet", x: 0.22, y: 0.46 },
  { id: "toilet-2", name: "女子トイレ", type: "toilet", x: 0.78, y: 0.52 },
  { id: "trash-1", name: "ゴミ箱", type: "trash", x: 0.35, y: 0.66 },
  { id: "trash-2", name: "ゴミ箱", type: "trash", x: 0.62, y: 0.28 },
];

export default amenities;
