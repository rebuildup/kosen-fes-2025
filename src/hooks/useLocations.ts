// src/hooks/useLocations.ts
import { useState, useEffect } from "react";
import { Event } from "./useEvents";

export interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  color: string;
  events: {
    id: string | number;
    title: string;
    time: string;
    type: "event" | "exhibit";
  }[];
  // マップでの表示に必要なプロパティ
  shape: "rect" | "circle" | "polygon";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: string;
  labelX?: number;
  labelY?: number;
}

// モックデータ - 実際のアプリでは、APIからデータを取得するかもしれません
const mockLocations: Location[] = [
  {
    id: "main-stage",
    name: "メインステージ",
    type: "ステージ",
    description:
      "主要なパフォーマンスやセレモニーが行われる大きなステージです。",
    image: "https://source.unsplash.com/random/600x400/?stage",
    color: "#f44336",
    events: [
      {
        id: "1",
        title: "開会式",
        time: "10:00",
        type: "event",
      },
      {
        id: "5",
        title: "ライブミュージックコンサート",
        time: "18:00",
        type: "event",
      },
      {
        id: "9",
        title: "閉会式",
        time: "17:00",
        type: "event",
      },
    ],
    shape: "rect",
    x: 500,
    y: 120,
    width: 180,
    height: 100,
    labelX: 590,
    labelY: 170,
  },
  {
    id: "gymnasium",
    name: "体育館",
    type: "パフォーマンススペース",
    description:
      "ダンスや演劇など、様々なパフォーマンスが行われる広いスペースです。",
    image: "https://source.unsplash.com/random/600x400/?gymnasium",
    color: "#2196f3",
    events: [
      {
        id: "2",
        title: "伝統舞踊パフォーマンス",
        time: "13:00",
        type: "event",
      },
    ],
    shape: "rect",
    x: 500,
    y: 380,
    width: 180,
    height: 100,
    labelX: 590,
    labelY: 430,
  },
  {
    id: "art-studio",
    name: "アートスタジオ",
    type: "ワークショップスペース",
    description:
      "アート関連のワークショップや展示が行われる創造的なスペースです。",
    image: "https://source.unsplash.com/random/600x400/?art-studio",
    color: "#4caf50",
    events: [
      {
        id: "3",
        title: "アートワークショップ",
        time: "15:00",
        type: "event",
      },
    ],
    shape: "rect",
    x: 120,
    y: 120,
    width: 180,
    height: 100,
    labelX: 210,
    labelY: 170,
  },
  {
    id: "cafeteria",
    name: "食堂",
    type: "飲食スペース",
    description: "様々な屋台や食べ物が楽しめるフードコートエリアです。",
    image: "https://source.unsplash.com/random/600x400/?cafeteria",
    color: "#ff9800",
    events: [
      {
        id: "4",
        title: "学食フェア",
        time: "11:00",
        type: "exhibit",
      },
    ],
    shape: "rect",
    x: 120,
    y: 380,
    width: 180,
    height: 100,
    labelX: 210,
    labelY: 430,
  },
  {
    id: "auditorium",
    name: "講堂",
    type: "上映スペース",
    description: "映画上映や講演などが行われる大きなホールです。",
    image: "https://source.unsplash.com/random/600x400/?auditorium",
    color: "#9c27b0",
    events: [
      {
        id: "8",
        title: "映画上映会",
        time: "14:00",
        type: "event",
      },
    ],
    shape: "circle",
    x: 400,
    y: 180,
    radius: 60,
    labelX: 400,
    labelY: 180,
  },
  {
    id: "research-building",
    name: "研究棟",
    type: "展示スペース",
    description: "研究プロジェクトや学術的な展示が行われる建物です。",
    image: "https://source.unsplash.com/random/600x400/?laboratory",
    color: "#607d8b",
    events: [
      {
        id: "6",
        title: "研究展示: 未来の技術",
        time: "10:00",
        type: "exhibit",
      },
    ],
    shape: "circle",
    x: 400,
    y: 420,
    radius: 60,
    labelX: 400,
    labelY: 420,
  },
  {
    id: "tech-building",
    name: "技術棟",
    type: "競技スペース",
    description:
      "ロボットやプログラミングなどの技術系イベントが行われるスペースです。",
    image: "https://source.unsplash.com/random/600x400/?robotics",
    color: "#ff5722",
    events: [
      {
        id: "7",
        title: "ロボット競技大会",
        time: "13:00",
        type: "event",
      },
    ],
    shape: "polygon",
    x: 650,
    y: 510,
    points: "650,510 750,450 750,550 650,600",
    labelX: 700,
    labelY: 550,
  },
];

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // APIからデータを取得する代わりに、モックデータを使用
    const fetchLocations = async () => {
      try {
        // モックデータの読み込みを模倣するため、短い遅延を追加
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLocations(mockLocations);
      } catch (error) {
        console.error("会場情報の読み込み中にエラーが発生しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading };
};
