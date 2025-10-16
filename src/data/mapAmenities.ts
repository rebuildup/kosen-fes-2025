export type Amenity = {
  id: string;
  type: "toilet" | "trash" | "water" | "info";
  name?: string;
  x: number; // map coordinates (same as events/exhibits)
  y: number;
};

// キャンパスマップ上のトイレとゴミ箱の位置
const amenities: Amenity[] = [
  // トイレ（主要な建物付近）
  { id: "toilet-1", name: "一般棟トイレ", type: "toilet", x: 350, y: 850 },
  { id: "toilet-2", name: "管理棟トイレ", type: "toilet", x: 150, y: 650 },
  { id: "toilet-3", name: "機電棟トイレ", type: "toilet", x: 350, y: 750 },
  { id: "toilet-4", name: "第一体育館トイレ", type: "toilet", x: 900, y: 900 },
  { id: "toilet-5", name: "第二体育館トイレ", type: "toilet", x: 1100, y: 600 },

  // ゴミ箱（主要エリア）
  { id: "trash-1", name: "フードコートゴミ箱", type: "trash", x: 600, y: 780 },
  { id: "trash-2", name: "一般棟前ゴミ箱", type: "trash", x: 400, y: 900 },
  {
    id: "trash-3",
    name: "メインステージ横ゴミ箱",
    type: "trash",
    x: 1050,
    y: 850,
  },
  { id: "trash-4", name: "体育館前ゴミ箱", type: "trash", x: 950, y: 800 },
  { id: "trash-5", name: "管理棟前ゴミ箱", type: "trash", x: 200, y: 700 },
];

export default amenities;
