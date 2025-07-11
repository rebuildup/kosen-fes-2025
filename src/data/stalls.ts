// src/data/stalls.ts
import { Stall } from "../types/common";

export const stalls: Stall[] = [
  {
    id: "stall-1",
    type: "stall",
    title: "たこ焼き",
    description: "女子バレーボール部による美味しいたこ焼きをご提供！",
    imageUrl: "./images/stalls/stall-1.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟前",
    coordinates: { x: 88.0, y: 968.5 },
    tags: ["露店", "食べ物", "和食"],
    organizer: "女子バレーボール部",
    products: ["たこ焼き", "チーズたこ焼き", "たこ焼きセット"],
  },
  {
    id: "stall-2",
    type: "stall",
    title: "タピオカ",
    description: "1年D組による爽やかなタピオカミルクティーとフルーツティー！",
    imageUrl: "./images/stalls/stall-2.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟前",
    coordinates: { x: 121.4, y: 967.4 },
    tags: ["露店", "飲み物", "スイーツ"],
    organizer: "1D",
    products: ["ミルクティー", "フルーツティー", "黒糖ミルクティー"],
  },
  {
    id: "stall-3",
    type: "stall",
    title: "フランクフルト＆フライドポテト",
    description:
      "後援会による定番の祭り食！ジューシーなフランクフルトとサクサクのフライドポテト！",
    imageUrl: "./images/stalls/stall-3.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟前",
    coordinates: { x: 158.8, y: 966.2 },
    tags: ["露店", "食べ物", "洋食"],
    organizer: "後援会",
    products: ["フランクフルト", "フライドポテト", "コンボセット"],
  },
  {
    id: "stall-4",
    type: "stall",
    title: "フライドチキン",
    description: "卓球部によるサクサク香ばしいフライドチキン！",
    imageUrl: "./images/stalls/stall-4.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟前",
    coordinates: { x: 279.3, y: 966.8 },
    tags: ["露店", "食べ物", "洋食"],
    organizer: "卓球部",
    products: [
      "通常フライドチキン",
      "スパイシーフライドチキン",
      "チキンボックス",
    ],
  },
  {
    id: "stall-5",
    type: "stall",
    title: "焼き餃子",
    description: "5Bによる美味しい焼き餃子!",
    imageUrl: "./images/stalls/stall-5.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟前",
    coordinates: { x: 347.1, y: 966.2 },
    tags: ["露店", "食べ物", "中華"],
    organizer: "5B",
    products: ["餃子(6個)", "餃子(10個)", "餃子定食"],
  },
  {
    id: "stall-6",
    type: "stall",
    title: "うどん",
    description: "バドミントン部による温かく心のこもったうどん！",
    imageUrl: "./images/stalls/stall-6.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟前",
    coordinates: { x: 398.5, y: 966.8 },
    tags: ["露店", "食べ物", "和食"],
    organizer: "バドミントン部",
    products: ["かけうどん", "天ぷらうどん", "肉うどん"],
  },
  {
    id: "stall-7",
    type: "stall",
    title: "大学いもスティック",
    description: "弓道部による完璧なおやつ！サクサクの大学いもスティック！",
    imageUrl: "./images/stalls/stall-7.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "一般棟外",
    coordinates: { x: 498.5, y: 904.8 },
    tags: ["露店", "食べ物", "スイーツ"],
    organizer: "弓道部",
    products: [
      "通常大学いもスティック",
      "ハニーグレーズスティック",
      "スパイシースティック",
    ],
  },
  {
    id: "stall-8",
    type: "stall",
    title: "ドーナツ",
    description: "大地製菓による様々なトッピングの出来立てドーナツ！",
    imageUrl: "./images/stalls/stall-8.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟 付近",
    coordinates: { x: 405.3, y: 860.9 },
    tags: ["露店", "食べ物", "スイーツ"],
    organizer: "大地製菓",
    products: [
      "プレーンドーナツ",
      "チョコレートドーナツ",
      "ストロベリードーナツ",
      "詰め合わせボックス",
    ],
  },
  {
    id: "stall-9",
    type: "stall",
    title: "チーズ＆チョコクリスピー",
    description:
      "吹奏楽部によるチーズまたはチョコレート味のサクサクライススナック！",
    imageUrl: "./images/stalls/stall-9.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "管理棟 付近",
    coordinates: { x: 340.1, y: 858.3 },
    tags: ["露店", "食べ物", "スイーツ"],
    organizer: "吹奏楽部",
    products: ["チーズクリスピー", "チョコクリスピー", "ミックスパック"],
  },
  {
    id: "stall-10",
    type: "stall",
    title: "ポップコーン",
    description: "専攻科2年生による様々な味の出来立てポップコーン!",
    imageUrl: "./images/stalls/stall-10.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "機電棟 付近",
    coordinates: { x: 341.4, y: 817.4 },
    tags: ["露店", "食べ物", "専攻科"],
    organizer: "専攻科2年",
    products: [
      "キャラメルポップコーン",
      "塩味ポップコーン",
      "チーズポップコーン",
    ],
  },
  {
    id: "stall-11",
    type: "stall",
    title: "白玉ぜんざい",
    description: "囲碁・将棋部による伝統的な和スイーツ！白玉入りぜんざい！",
    imageUrl: "./images/stalls/stall-11.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "機電棟 付近",
    coordinates: { x: 406.7, y: 812.1 },
    tags: ["露店", "食べ物", "和食"],
    organizer: "囲碁・将棋部",
    products: ["白玉ぜんざい", "あずき入りぜんざい", "スペシャルぜんざい"],
  },
  {
    id: "stall-12",
    type: "stall",
    title: "チーズボール",
    description: "学生会による美味しい揚げチーズボール！",
    imageUrl: "./images/stalls/stall-12.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "一般棟前",
    coordinates: { x: 496.4, y: 733.6 },
    tags: ["露店", "食べ物", "洋食"],
    organizer: "学生会",
    products: [
      "通常チーズボール",
      "スパイシーチーズボール",
      "ミックスボックス",
    ],
  },
  {
    id: "stall-13",
    type: "stall",
    title: "ソフトドリンク",
    description: "男子バスケ部によるソフトドリンク!",
    imageUrl: "./images/stalls/stall-13.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "一般棟前",
    coordinates: { x: 535.6, y: 880.3 },
    tags: ["露店", "飲み物", "清涼飲料"],
    organizer: "男子バスケ部",
    products: ["コーラ", "サイダー", "オレンジジュース", "お茶"],
  },

  {
    id: "stall-15",
    type: "stall",
    title: "ベビーカステラ",
    description:
      "2Sによる美味しいベビーカステラをお楽しみください。",
    imageUrl: "./images/stalls/stall-21.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "一般棟前",
    coordinates: { x: 628.2, y: 883.2 },
    tags: ["露店", "食べ物", "スイーツ"],
    organizer: "2S",
    products: ["ベビーカステラ"],
  },
  {
    id: "stall-16",
    type: "stall",
    title: "綿菓子",
    description:
      "男子バレー部による美味しいベビーカステラをお楽しみください。",
    imageUrl: "./images/stalls/stall-16.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "一般棟前",
    coordinates: { x: 684.5, y: 877.1 },
    tags: ["露店", "食べ物", "スイーツ"],
    organizer: "男子バレー部",
    products: ["綿菓子"],
  },
  {
    id: "stall-17",
    type: "stall",
    title: "チャーシュー丼",
    description:
      "チーム優勝による美味しいベビーカステラをお楽しみください。",
    imageUrl: "./images/stalls/stall-17.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "一般棟前",
    coordinates: { x: 738.2, y: 879.8 },
    tags: ["露店", "食べ物", "中華"],
    organizer: "チーム優勝",
    products: ["チャーシュー丼"],
  },
  {
    id: "stall-21",
    type: "stall",
    title: "お抹茶＆和菓子",
    description:
      "茶道部による本格的なお抹茶と美味しい和菓子をお楽しみください。",
    imageUrl: "./images/stalls/stall-21.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "食堂 横",
    coordinates: { x: 543.4, y: 756.5 },
    tags: ["露店", "飲み物", "和食"],
    organizer: "茶道部",
    products: ["抹茶", "和菓子", "お茶セット"],
  },
  {
    id: "stall-22",
    type: "stall",
    title: "焼きそば",
    description: "5Mによる定番の焼きそば！",
    imageUrl: "./images/stalls/stall-22.jpg",
    date: "2025-11-08",
    time: "10:00 - 18:00",
    location: "一般棟 前",
    coordinates: { x: 577.3, y: 879.6 },
    tags: ["露店", "食べ物", "和食"],
    organizer: "5M",
    products: ["焼きそば", "野菜焼きそば", "特製焼きそば"],
  },

];
