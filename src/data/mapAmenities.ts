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
  { id: "toilet-1", name: "経営棟トイレ", type: "toilet", x: 400, y: 360 },
  {
    id: "toilet-2",
    name: "第一体育館トイレ 男",
    type: "toilet",
    x: 80,
    y: 220,
  },
  {
    id: "toilet-2-2",
    name: "第一体育館トイレ 女",
    type: "toilet",
    x: 130,
    y: 220,
  },
  { id: "toilet-3", name: "学生会館トイレ", type: "toilet", x: 590, y: 690 },
  { id: "toilet-4", name: "図書館棟トイレ", type: "toilet", x: 530, y: 540 },
  { id: "toilet-5", name: "一般棟トイレ", type: "toilet", x: 730, y: 930 },
  { id: "toilet-6", name: "物質棟トイレ", type: "toilet", x: 580, y: 1080 },

  // ゴミ箱（主要エリア）
  { id: "trash-1", name: "学生会館 ゴミ箱", type: "trash", x: 530, y: 690 },
];

export default amenities;
