// src/data/events.ts
import { Event } from "../types/common";

export const events: Event[] = [
  {
    id: "event-1",
    type: "event",
    title: "開会式",
    description:
      "正門で一緒に風船を飛ばそう!風船を飛ばした方にはプレゼントがあります!一般の方も参加できます!(先着200-300名)",
    imageUrl: "./images/events/event-1.jpg",
    date: "2025-11-08",
    time: "9:30 - 10:30",
    location: "正門",
    coordinates: { x: 500, y: 400 }, // 正門
    tags: ["セレモニー", "開会", "参加型"],
    organizer: "実行委員会",
    duration: 60,
  },
  {
    id: "event-2",
    type: "event",
    title: "映えコン",
    description:
      "「映え」の瞬間をInstagramに投稿しよう!参加方法:1. kousensai_2025をタグ付け+メンション 2. 「#2025高専祭」をつけて投稿",
    imageUrl: "./images/events/event-2.jpg",
    date: "2025-11-08",
    time: "9:30 - 14:00",
    location: "キャンパス全域",
    coordinates: { x: 1000, y: 700 }, // キャンパス中央
    tags: ["コンテスト", "インスタグラム", "写真"],
    organizer: "メディア部",
    duration: 1710, // from 9:30 on day 1 to 14:00 on day 2
  },
  {
    id: "event-3",
    type: "event",
    title: "カラオケ大会予選",
    description:
      "歌唱力を魅せつけろ。一般の方も参加できます!1日目は予選、2日目は決勝戦を行います。",
    imageUrl: "./images/events/event-3.jpg",
    date: "2025-11-08",
    time: "11:30 - 13:00",
    location: "メインステージ",
    coordinates: { x: 168.8, y: 250 }, // 第二体育館近く（メインステージ）
    tags: ["コンテスト", "音楽", "パフォーマンス"],
    organizer: "音楽部",
    duration: 90,
  },
  {
    id: "event-4",
    type: "event",
    title: "カラオケ大会決勝",
    description: "カラオケ大会の決勝戦!歌のチャンピオンは誰の手に!?",
    imageUrl: "./images/events/event-4.jpg",
    date: "2025-11-09",
    time: "12:00 - 13:30",
    location: "メインステージ",
    coordinates: { x: 168.8, y: 250 }, // 第二体育館近く（メインステージ）
    tags: ["コンテスト", "音楽", "パフォーマンス"],
    organizer: "音楽部",
    duration: 90,
  },
  {
    id: "event-5",
    type: "event",
    title: "ビンゴ大会",
    description:
      "運試し、やっていきませんか?一般の方も参加できます!素敵な賞品が当たります!",
    imageUrl: "./images/events/event-5.jpg",
    date: "2025-11-08",
    time: "10:00 - 11:00",
    location: "メインステージ",
    coordinates: { x: 168.8, y: 250 }, // 第二体育館近く（メインステージ）
    tags: ["ゲーム", "ビンゴ", "賞品"],
    organizer: "学生会",
    duration: 60,
  },
  {
    id: "event-6",
    type: "event",
    title: "献血",
    description:
      "ご協力いただいた方全員に特別な記念品をプレゼント!200mL献血(学生限定):16歳以上、男性45kg以上、女性40kg以上。※人数に限りがあります。400mL献血:男性17歳以上、女性18歳以上、体重50kg以上。定員あり!",
    imageUrl: "./images/events/event-6.jpg",
    date: "2025-11-08",
    time: "9:30 - 16:00",
    location: "ペリカン食堂 学生会館1F",
    coordinates: { x: 588.6, y: 733.5 }, // 学生会館
    tags: ["ボランティア", "健康", "地域貢献"],
    organizer: "保健委員会",
    duration: 390, // 9:30-12:00 and 13:15-16:00 = 2.5 + 2.75 = 5.25 hours = 315 minutes
  },
  {
    id: "event-7",
    type: "event",
    title: "ダーツゲーム",
    description: "参加無料!西日本自動車学校主催。",
    imageUrl: "./images/events/event-7.jpg",
    date: "2025-11-08",
    time: "10:00 - 16:00",
    location: "第2体育館",
    coordinates: { x: 168.8, y: 193.8 }, // 第二体育館
    tags: ["ゲーム", "ダーツ", "無料"],
    organizer: "西日本自動車学校",
    duration: 360,
  },
  {
    id: "event-8",
    type: "event",
    title: "スーパーボールすくい",
    description:
      "抽選券でスーパーボールをすくって賞品をゲット!はずれ券なし!宇部自動車学校主催。",
    imageUrl: "./images/events/event-8.jpg",
    date: "2025-11-08",
    time: "10:00 - 16:00",
    location: "第2体育館",
    coordinates: { x: 168.8, y: 193.8 }, // 第二体育館
    tags: ["ゲーム", "賞品", "すくい"],
    organizer: "宇部自動車学校",
    duration: 360,
  },
  {
    id: "event-9",
    type: "event",
    title: "仮装コンテスト",
    description:
      "あなたの創造力を輝かせよう!ユニークなコスチュームで祭りを盛り上げよう!",
    imageUrl: "./images/events/event-9.jpg",
    date: "2025-11-09",
    time: "16:40 - 17:30",
    location: "第1体育館",
    coordinates: { x: 1017.8, y: 1088.2 }, // 第一体育館
    tags: ["コンテスト", "コスプレ", "創作"],
    organizer: "エンターテイメント委員会",
    duration: 50,
  },
  {
    id: "event-10",
    type: "event",
    title: "○×クイズ大会",
    description:
      "クイズ王は誰だ!?様々なジャンルの問題が出題されます。一般の方も参加できます!",
    imageUrl: "./images/events/event-10.jpg",
    date: "2025-11-09",
    time: "10:00 - 11:30",
    location: "メインステージ",
    coordinates: { x: 168.8, y: 250 }, // 第二体育館近く（メインステージ）
    tags: ["クイズ", "コンテスト", "知識"],
    organizer: "クイズ研究会",
    duration: 90,
  },
  {
    id: "event-11",
    type: "event",
    title: "どきどきパターGolf",
    description:
      "参加無料!ゲームをクリアして賞品をゲット!宇部中央自動車学校主催。",
    imageUrl: "./images/events/event-11.jpg",
    date: "2025-11-09",
    time: "10:00 - 16:00",
    location: "第2体育館",
    coordinates: { x: 168.8, y: 193.8 }, // 第二体育館
    tags: ["ゲーム", "ゴルフ", "賞品"],
    organizer: "宇部中央自動車学校",
    duration: 360,
  },
  {
    id: "event-12",
    type: "event",
    title: "抽選会-前半",
    description:
      "50名様に豪華賞品が当たる!!抽選会の受付は9:30-15:00にメインステージ(第2体育館)で行います。",
    imageUrl: "./images/events/event-12.jpg",
    date: "2025-11-09",
    time: "16:00 - 17:00",
    location: "第1体育館",
    coordinates: { x: 1017.8, y: 1088.2 }, // 第一体育館
    tags: ["抽選", "賞品", "抽選会"],
    organizer: "実行委員会",
    duration: 60,
  },
  {
    id: "event-13",
    type: "event",
    title: "抽選会-後半",
    description: "さらに豪華な賞品が当たる抽選会の後半戦!",
    imageUrl: "./images/events/event-12.jpg",
    date: "2025-11-09",
    time: "17:20 - 18:00",
    location: "第1体育館",
    coordinates: { x: 1017.8, y: 1088.2 }, // 第一体育館
    tags: ["抽選", "賞品", "抽選会"],
    organizer: "実行委員会",
    duration: 40,
  },
  {
    id: "event-14",
    type: "event",
    title: "エンディング",
    description:
      "光る風船を飛ばします!エンディング映像も上映!抽選会終了後、正門にお集まりください。",
    imageUrl: "./images/events/event-14.jpg",
    date: "2025-11-09",
    time: "18:10 - 19:00",
    location: "正門",
    coordinates: { x: 500, y: 400 }, // 正門
    tags: ["セレモニー", "閉会", "風船"],
    organizer: "実行委員会",
    duration: 50,
  },
];
