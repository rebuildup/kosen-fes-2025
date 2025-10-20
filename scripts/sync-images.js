#!/usr/bin/env node

/**
 * 実際のサイトの画像と現在のプロジェクトの画像を同期するスクリプト
 * 不足している画像を追加し、不要な画像を削除
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 実際のサイトで使用されている画像ファイル一覧
const actualSiteImages = [
  // Events
  "events/event-1.png",
  "events/event-2.jpg",
  "events/event-3.jpg",
  "events/event-4.jpg",
  "events/event-5.jpg",
  "events/event-6.jpg",
  "events/event-7.jpg",
  "events/event-8.jpg",
  "events/event-9.jpg",
  "events/event-10.jpg",
  "events/event-11.jpg",
  "events/event-12.jpg",
  "events/event-13.jpg",
  "events/event-15.jpg",

  // Bands
  "bands/band-1.png",
  "bands/band-2.png",
  "bands/band-3.png",
  "bands/band-4.png",
  "bands/band-5.png",
  "bands/band-6.png",
  "bands/band-7.png",
  "bands/band-8.png",
  "bands/band-9.png",
  "bands/band-10.png",
  "bands/band-11.png",
  "bands/band-12.png",
  "bands/band-13.png",
  "bands/band-14.png",
  "bands/band-15.png",
  "bands/band-16.png",
  "bands/band-17.png",
  "bands/band-18.png",
  "bands/band-19.png",
  "bands/band-20.png",
  "bands/band-21.png",
  "bands/band-22.png",
  "bands/band-23.png",

  // Exhibits
  "exhibits/exhibit-1.jpg",
  "exhibits/exhibit-2.jpg",
  "exhibits/exhibit-3.jpg",
  "exhibits/exhibit-4.jpeg",
  "exhibits/exhibit-5.jpg",
  "exhibits/exhibit-6.jpg",
  "exhibits/exhibit-7.jpg",
  "exhibits/exhibit-8.jpg",
  "exhibits/exhibit-9.jpg",
  "exhibits/exhibit-10.jpg",
  "exhibits/exhibit-11.jpg",
  "exhibits/exhibit-12.jpg",
  "exhibits/exhibit-13.jpg",

  // Stalls
  "stalls/stall-1.jpg",
  "stalls/stall-2.jpg",
  "stalls/stall-3.jpg",
  "stalls/stall-4.jpg",
  "stalls/stall-5.jpg",
  "stalls/stall-6.jpg",
  "stalls/stall-7.jpg",
  "stalls/stall-8.jpg",
  "stalls/stall-9.jpg",
  "stalls/stall-10.jpg",
  "stalls/stall-11.jpg",
  "stalls/stall-11-1.jpg",
  "stalls/stall-11-2.jpg",
  "stalls/stall-12.jpg",
  "stalls/stall-13.jpg",
  "stalls/stall-16.jpg",
  "stalls/stall-17.jpg",
  "stalls/stall-18.jpg",
  "stalls/stall-19.jpg",
  "stalls/stall-20.jpg",
  "stalls/stall-21.jpg",
  "stalls/stall-22.jpg",
  "stalls/stall-23.jpg",
  "stalls/stall-24.jpg",
  "stalls/stall-25.jpg",
  "stalls/stall-26.jpg",
  "stalls/stall-27.jpg",
  "stalls/stall-28.jpg",
];

// 現在のプロジェクトで使用されている画像ファイル一覧を取得
function getCurrentProjectImages() {
  const imagesDir = path.join(__dirname, "..", "public", "images");
  const currentImages = [];

  const categories = ["events", "bands", "exhibits", "stalls"];

  categories.forEach((category) => {
    const categoryDir = path.join(imagesDir, category);
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir);
      files.forEach((file) => {
        // .webpファイルは除外（実際のサイトでは使用されていない）
        if (!file.endsWith(".webp") && !file.endsWith(".txt")) {
          currentImages.push(`${category}/${file}`);
        }
      });
    }
  });

  return currentImages;
}

// メイン処理
function main() {
  console.log("Syncing images with actual site...");

  const currentImages = getCurrentProjectImages();

  console.log("\n=== Current Project Images ===");
  currentImages.forEach((img) => console.log(img));

  console.log("\n=== Actual Site Images ===");
  actualSiteImages.forEach((img) => console.log(img));

  // 不足している画像を特定
  const missingImages = actualSiteImages.filter(
    (img) => !currentImages.includes(img),
  );
  console.log("\n=== Missing Images ===");
  missingImages.forEach((img) => console.log(img));

  // 不要な画像を特定
  const extraImages = currentImages.filter(
    (img) => !actualSiteImages.includes(img),
  );
  console.log("\n=== Extra Images (not used on actual site) ===");
  extraImages.forEach((img) => console.log(img));

  console.log("\n=== Summary ===");
  console.log(`Current project images: ${currentImages.length}`);
  console.log(`Actual site images: ${actualSiteImages.length}`);
  console.log(`Missing images: ${missingImages.length}`);
  console.log(`Extra images: ${extraImages.length}`);

  if (missingImages.length > 0) {
    console.log("\n⚠️  Some images are missing from the current project!");
    console.log(
      "These images exist on the actual site but not in the current project.",
    );
  }

  if (extraImages.length > 0) {
    console.log(
      "\n⚠️  Some images in the current project are not used on the actual site!",
    );
    console.log("These images can be safely removed.");
  }

  if (missingImages.length === 0 && extraImages.length === 0) {
    console.log("\n✅ All images are in sync!");
  }
}

// スクリプト実行
main();
