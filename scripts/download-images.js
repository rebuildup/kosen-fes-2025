#!/usr/bin/env node

/**
 * 実際のデプロイサイトから画像をダウンロードするスクリプト
 * https://www2.ube-k.ac.jp/fes2025/ から画像を取得
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 実際のサイトから取得した画像URL一覧
const imageUrls = [
  // Events
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-1.png",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-2.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-3.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-4.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-5.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-6.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-7.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-8.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-9.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-10.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-11.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-12.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-13.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/events/event-15.jpg",

  // Bands
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-1.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-2.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-3.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-4.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-5.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-6.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-7.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-8.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-9.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-10.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-11.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-12.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-13.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-14.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-15.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-16.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-17.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-18.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-19.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-20.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-21.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-22.png",
  "https://www2.ube-k.ac.jp/fes2025/images/bands/band-23.png",

  // Exhibits
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-1.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-2.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-3.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-4.jpeg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-5.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-6.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-7.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-8.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-9.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-10.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-11.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-12.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/exhibits/exhibit-13.jpg",

  // Stalls
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-1.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-2.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-3.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-4.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-5.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-6.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-7.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-8.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-9.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-10.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-11.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-11-1.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-11-2.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-12.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-13.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-16.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-17.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-18.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-19.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-20.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-21.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-22.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-23.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-24.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-25.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-26.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-27.jpg",
  "https://www2.ube-k.ac.jp/fes2025/images/stalls/stall-28.jpg",
];

// 画像をダウンロードする関数
async function downloadImage(url, filePath) {
  try {
    console.log(`Downloading: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // ファイルに書き込み
    fs.writeFileSync(filePath, uint8Array);
    console.log(`Saved: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

// メイン処理
async function main() {
  console.log("Starting image download...");

  for (const url of imageUrls) {
    // URLからファイルパスを抽出
    const urlPath = new URL(url).pathname;
    const fileName = path.basename(urlPath);
    const category = path.basename(path.dirname(urlPath));

    // ローカルファイルパスを構築
    const localPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      category,
      fileName,
    );

    // 画像をダウンロード
    await downloadImage(url, localPath);

    // 少し待機（サーバーに負荷をかけないため）
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("Image download completed!");
}

// スクリプト実行
main().catch(console.error);
