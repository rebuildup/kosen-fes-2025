// src/hooks/useEvents.ts
import { useState, useEffect } from "react";

export interface Event {
  id: string | number;
  title: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  locationId: string | number;
  category: string;
  description: string;
  image: string;
  organizer?: string;
  tags: string[];
  type: "event" | "exhibit";
}

// モックデータ - 実際のアプリでは、APIからデータを取得するかもしれません
const mockEvents: Event[] = [
  {
    id: "1",
    title: "開会式",
    date: "2025-05-15",
    time: "10:00",
    endTime: "11:00",
    location: "メインステージ",
    locationId: "main-stage",
    category: "ceremony",
    description:
      "宇部高専祭2025の開会式です。学校代表の挨拶や特別パフォーマンスがあります。",
    image: "https://source.unsplash.com/random/600x400/?ceremony",
    organizer: "学生会",
    tags: ["開会式", "セレモニー"],
    type: "event",
  },
  {
    id: "2",
    title: "伝統舞踊パフォーマンス",
    date: "2025-05-15",
    time: "13:00",
    endTime: "14:30",
    location: "体育館",
    locationId: "gymnasium",
    category: "performance",
    description: "地域の伝統舞踊を披露するパフォーマンスです。",
    image: "https://source.unsplash.com/random/600x400/?dance",
    organizer: "ダンス部",
    tags: ["伝統舞踊", "パフォーマンス", "文化"],
    type: "event",
  },
  {
    id: "3",
    title: "アートワークショップ",
    date: "2025-05-15",
    time: "15:00",
    endTime: "17:00",
    location: "アートスタジオ",
    locationId: "art-studio",
    category: "workshop",
    description:
      "プロのアーティストの指導のもと、自分だけのアート作品を作りましょう。",
    image: "https://source.unsplash.com/random/600x400/?art,workshop",
    organizer: "美術部",
    tags: ["ワークショップ", "アート", "DIY"],
    type: "event",
  },
  {
    id: "4",
    title: "学食フェア",
    date: "2025-05-15",
    time: "11:00",
    endTime: "18:00",
    location: "食堂",
    locationId: "cafeteria",
    category: "food",
    description: "各クラスが出店する屋台で様々な料理を楽しめます。",
    image: "https://source.unsplash.com/random/600x400/?food,festival",
    organizer: "料理研究会",
    tags: ["フード", "屋台", "グルメ"],
    type: "exhibit",
  },
  {
    id: "5",
    title: "ライブミュージックコンサート",
    date: "2025-05-15",
    time: "18:00",
    endTime: "20:00",
    location: "メインステージ",
    locationId: "main-stage",
    category: "performance",
    description: "学生バンドによるライブパフォーマンスです。",
    image: "https://source.unsplash.com/random/600x400/?concert",
    organizer: "軽音楽部",
    tags: ["音楽", "ライブ", "コンサート"],
    type: "event",
  },
  {
    id: "6",
    title: "研究展示: 未来の技術",
    date: "2025-05-16",
    time: "10:00",
    endTime: "17:00",
    location: "研究棟",
    locationId: "research-building",
    category: "exhibition",
    description: "学生が開発した革新的な技術プロジェクトの展示です。",
    image: "https://source.unsplash.com/random/600x400/?technology",
    organizer: "科学技術研究会",
    tags: ["研究", "技術", "展示"],
    type: "exhibit",
  },
  {
    id: "7",
    title: "ロボット競技大会",
    date: "2025-05-16",
    time: "13:00",
    endTime: "16:00",
    location: "技術棟",
    locationId: "tech-building",
    category: "competition",
    description: "自作のロボットによる競技大会です。速さや正確性を競います。",
    image: "https://source.unsplash.com/random/600x400/?robot",
    organizer: "ロボット工学部",
    tags: ["ロボット", "競技", "工学"],
    type: "event",
  },
  {
    id: "8",
    title: "映画上映会",
    date: "2025-05-16",
    time: "14:00",
    endTime: "16:00",
    location: "講堂",
    locationId: "auditorium",
    category: "film",
    description: "学生制作のオリジナル映画の上映会です。",
    image: "https://source.unsplash.com/random/600x400/?cinema",
    organizer: "映画研究会",
    tags: ["映画", "上映会", "エンターテイメント"],
    type: "event",
  },
  {
    id: "9",
    title: "閉会式",
    date: "2025-05-16",
    time: "17:00",
    endTime: "18:00",
    location: "メインステージ",
    locationId: "main-stage",
    category: "ceremony",
    description:
      "宇部高専祭2025の閉会式です。各コンテストの表彰式も行われます。",
    image: "https://source.unsplash.com/random/600x400/?awards",
    organizer: "学生会",
    tags: ["閉会式", "表彰式", "セレモニー"],
    type: "event",
  },
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // APIからデータを取得する代わりに、モックデータを使用
    // 実際のアプリでは、fetch APIなどを使ってデータを取得します
    const fetchEvents = async () => {
      try {
        // モックデータの読み込みを模倣するため、短い遅延を追加
        await new Promise((resolve) => setTimeout(resolve, 500));
        setEvents(mockEvents);
      } catch (error) {
        console.error("イベントの読み込み中にエラーが発生しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // イベントのカテゴリのリストを取得
  const categories = ["all", ...new Set(events.map((event) => event.category))];

  return { events, loading, categories };
};

// 注目イベントのみを取得するフック
export const useFeaturedEvents = () => {
  const { events, loading } = useEvents();
  // フィーチャードイベントをフィルタリング（例：最初の5つのイベント）
  const featuredEvents = events.slice(0, 5);

  return { events: featuredEvents, loading };
};
