// src/data/exhibits.ts
import { Exhibit } from "../types/common";

export const exhibits: Exhibit[] = [
  {
    id: "exhibit-1",
    type: "exhibit",
    title: "ロボット展示＆ミニゲーム",
    description:
      "ロボット研究部のメンバーが作成した様々なロボットの実演とミニゲームを体験できます!",
    imageUrl: "./images/exhibits/exhibit-1.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "工学部棟 101教室",
    coordinates: { x: 254.9, y: 752.5 }, // 機電棟エリア
    tags: ["ロボット", "技術", "ゲーム"],
    creator: "ロボット研究部",
  },
  {
    id: "exhibit-2",
    type: "exhibit",
    title: "創作作品展示",
    description:
      "マスターピース技術研究チームによる創作プロジェクトの展示です。",
    imageUrl: "./images/exhibits/exhibit-2.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "理学部棟 203教室",
    coordinates: { x: 704.0, y: 929.4 }, // 一般棟エリア
    tags: ["技術", "イノベーション", "工学"],
    creator: "マスターピース技術研究",
  },
  {
    id: "exhibit-3",
    type: "exhibit",
    title: "献血ステーション",
    description:
      "献血にご協力いただいた方には特別な記念品をプレゼント!フェスティバルを楽しみながら命を救う活動にご参加ください。",
    imageUrl: "./images/exhibits/exhibit-3.jpg",
    date: "2025-06-15",
    time: "9:30 - 16:00",
    location: "ペリカン食堂 学生会館1F",
    coordinates: { x: 588.6, y: 733.5 }, // 学生会館
    tags: ["健康", "コミュニティ", "ボランティア"],
    creator: "保健委員会",
  },
  {
    id: "exhibit-4",
    type: "exhibit",
    title: "写真展＆ポストカード販売",
    description:
      "写真部のメンバーが撮影した美しい写真の展示とオリジナルポストカードの販売!",
    imageUrl: "./images/exhibits/exhibit-4.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "教養棟 展示ホール",
    coordinates: { x: 590.5, y: 497.7 }, // 図書館棟
    tags: ["写真", "アート", "ポストカード"],
    creator: "写真部",
  },
  {
    id: "exhibit-5",
    type: "exhibit",
    title: "美術展＆ポストカード販売",
    description:
      "美術部のメンバーによるアート作品の展示とオリジナルポストカードの販売!",
    imageUrl: "./images/exhibits/exhibit-5.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "教養棟 美術室",
    coordinates: { x: 590.5, y: 497.7 }, // 図書館棟
    tags: ["アート", "展示", "ポストカード"],
    creator: "美術部",
  },
  {
    id: "exhibit-6",
    type: "exhibit",
    title: "文芸部誌配布",
    description: "文芸部のメンバーが制作したオリジナル文芸誌をゲットしよう!",
    imageUrl: "./images/exhibits/exhibit-6.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "教養棟 102教室",
    coordinates: { x: 590.5, y: 497.7 }, // 図書館棟
    tags: ["文学", "雑誌", "創作"],
    creator: "文芸部",
  },
  {
    id: "exhibit-7",
    type: "exhibit",
    title: "衣装＆アクセサリー展示",
    description:
      "平成フォトスタジオによるファッションアイテムとアクセサリーの展示。",
    imageUrl: "./images/exhibits/exhibit-7.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "学生会館 2F",
    coordinates: { x: 588.6, y: 733.5 }, // 学生会館
    tags: ["ファッション", "アクセサリー", "デザイン"],
    creator: "平成フォトスタジオ",
  },
  {
    id: "exhibit-8",
    type: "exhibit",
    title: "ETロボコン活動紹介",
    description: "ETロボコンチームの活動と成果について学ぼう!",
    imageUrl: "./images/exhibits/exhibit-8.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "工学部棟 201教室",
    coordinates: { x: 254.9, y: 752.5 }, // 機電棟エリア
    tags: ["ロボット", "コンテスト", "技術"],
    creator: "ETロボコンチーム",
  },
  {
    id: "exhibit-9",
    type: "exhibit",
    title: "Eプロジェクト活動紹介",
    description: "電気工学科の自主活動グループの紹介です。",
    imageUrl: "./images/exhibits/exhibit-9.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "電気工学棟 第1実験室",
    coordinates: { x: 254.9, y: 752.5 }, // 機電棟エリア
    tags: ["電気", "工学", "プロジェクト"],
    creator: "Eプロジェクト",
  },
  {
    id: "exhibit-10",
    type: "exhibit",
    title: "コンピュータ部制作展示",
    description:
      "コンピュータ部のメンバーが制作したソフトウェアとハードウェアのプロジェクト展示。",
    imageUrl: "./images/exhibits/exhibit-10.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "情報科学棟 103教室",
    coordinates: { x: 886.4, y: 859.4 }, // 経営情報学科棟
    tags: ["コンピュータ", "ソフトウェア", "プログラミング"],
    creator: "コンピュータ部",
  },
  {
    id: "exhibit-11",
    type: "exhibit",
    title: "オリジナルキーホルダー作り",
    description: "篠田研究室のブースでオリジナルキーホルダーを作ろう!",
    imageUrl: "./images/exhibits/exhibit-11.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "工学部棟 105教室",
    coordinates: { x: 254.9, y: 752.5 }, // 機電棟エリア
    tags: ["クラフト", "キーホルダー", "手作り"],
    creator: "篠田研究室",
  },
  {
    id: "exhibit-12",
    type: "exhibit",
    title: "船舶運動体験",
    description:
      "実践的な体験とデモンストレーションを通じて船の動きについて学ぼう!",
    imageUrl: "./images/exhibits/exhibit-12.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "機械工学棟 第2実験室",
    coordinates: { x: 254.9, y: 752.5 }, // 機電棟エリア
    tags: ["船舶", "機械", "工学"],
    creator: "機械工学科",
  },
  {
    id: "exhibit-13",
    type: "exhibit",
    title: "電気工学アトラクション",
    description:
      "ストライクアウトやVRゲームなど様々なアトラクションを楽しもう!学科展示も実施中。",
    imageUrl: "./images/exhibits/exhibit-13.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "電気工学棟 メインホール",
    coordinates: { x: 254.9, y: 752.5 }, // 機電棟エリア
    tags: ["電気", "ゲーム", "VR"],
    creator: "電気工学科",
  },
  {
    id: "exhibit-14",
    type: "exhibit",
    title: "スイカゲームでセンサー入力体験",
    description:
      "スイカをテーマにした楽しいゲームでセンサー入力技術を体験しよう!",
    imageUrl: "./images/exhibits/exhibit-14.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "制御工学棟 101教室",
    coordinates: { x: 368.7, y: 534.6 }, // 制御情報工学科棟
    tags: ["センサー", "ゲーム", "技術"],
    creator: "制御工学科",
  },
  {
    id: "exhibit-15",
    type: "exhibit",
    title: "材料工学体験",
    description:
      "材料工学に関連するデモンストレーション、体験、展示を行います。",
    imageUrl: "./images/exhibits/exhibit-15.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "材料工学棟 メイン実験室",
    coordinates: { x: 709.6, y: 1103.2 }, // 物質棟
    tags: ["材料", "化学", "工学"],
    creator: "材料工学科",
  },
  {
    id: "exhibit-16",
    type: "exhibit",
    title: "ホームカミングデー",
    description:
      "卒業生の皆様をお迎えする特別なイベント。懐かしい仲間との再会をお楽しみください。",
    imageUrl: "./images/exhibits/exhibit-16.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "管理棟 会議室",
    coordinates: { x: 227.3, y: 837.4 }, // 管理棟
    tags: ["同窓会", "卒業生", "交流"],
    creator: "同窓会",
  },
];
