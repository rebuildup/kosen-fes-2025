#!/usr/bin/env node

/**
 * Custom Static Site Generation script for React app
 * Generates static HTML files for all routes
 */

import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes to generate
const routes = [
  "/",
  "/events",
  "/exhibits",
  "/schedule",
  "/map",
  "/search",
  "/bookmarks",
  "/sponsors",
];

// Sponsor detail routes
const sponsorRoutes = [];
for (let i = 1; i <= 29; i++) {
  sponsorRoutes.push(`/detail/sponsor/sponsor-${i}`);
}

// Read the built index.html
const indexPath = path.join(__dirname, "../dist/index.html");
const indexHtml = fs.readFileSync(indexPath, "utf8");

// Create DOM environment
const dom = new JSDOM(indexHtml);
const document = dom.window.document;

// Function to generate static HTML for a route
function generateStaticHTML(route) {
  console.log(`Generating static HTML for route: ${route}`);

  // Clone the base HTML
  const html = indexHtml;

  // Update title and meta tags based on route
  let title = "宇部高専祭2025";
  let description =
    "宇部高専祭2025の公式サイト テーマはPOP! イベント/展示/屋台の情報を掲載";

  switch (route) {
    case "/events":
      title = "イベント一覧 | 宇部高専祭2025";
      description =
        "宇部高専祭2025のイベント一覧。ライブ、パフォーマンス、催し物の詳細情報。";
      break;
    case "/exhibits":
      title = "展示一覧 | 宇部高専祭2025";
      description =
        "宇部高専祭2025の展示一覧。学生作品、研究成果、技術展示の詳細情報。";
      break;
    case "/schedule":
      title = "スケジュール | 宇部高専祭2025";
      description =
        "宇部高専祭2025のタイムスケジュール。各イベントの開催時間を確認。";
      break;
    case "/map":
      title = "キャンパスマップ | 宇部高専祭2025";
      description =
        "宇部高専キャンパスマップ。各展示・屋台の場所を確認できます。";
      break;
    case "/search":
      title = "検索 | 宇部高専祭2025";
      description =
        "宇部高専祭2025のコンテンツ検索。イベント、展示、屋台を検索できます。";
      break;
    case "/bookmarks":
      title = "ブックマーク | 宇部高専祭2025";
      description =
        "お気に入りのイベント、展示、屋台をブックマークして管理できます。";
      break;
    case "/sponsors":
      title = "協賛企業 | 宇部高専祭2025";
      description =
        "宇部高専祭2025を支援していただいている協賛企業のご紹介。";
      break;
    default:
      // Handle sponsor detail pages
      if (route.startsWith("/detail/sponsor/")) {
        const sponsorId = route.split("/").pop();
        title = `協賛企業詳細 | 宇部高専祭2025`;
        description = `宇部高専祭2025の協賛企業${sponsorId}の詳細情報。`;
      }
      break;
  }

  // Update HTML content
  let updatedHtml = html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content=".*?"/,
      `<meta name="description" content="${description}"`,
    )
    .replace(
      /<meta property="og:title" content=".*?"/,
      `<meta property="og:title" content="${title}"`,
    )
    .replace(
      /<meta property="og:description" content=".*?"/,
      `<meta property="og:description" content="${description}"`,
    );

  // Add route-specific preload hints
  // Use prefetch for non-critical route data to avoid unused-preload warnings
  if (route === "/events") {
    updatedHtml = updatedHtml.replace(
      "</head>",
      '  <!-- Non-critical route data: use prefetch instead of preload to avoid unused-preload warnings -->\n  <link rel="prefetch" href="./assets/events.json" as="fetch" crossorigin="anonymous">\n</head>',
    );
  } else if (route === "/exhibits") {
    updatedHtml = updatedHtml.replace(
      "</head>",
      '  <!-- Non-critical route data: use prefetch instead of preload to avoid unused-preload warnings -->\n  <link rel="prefetch" href="./assets/exhibits.json" as="fetch" crossorigin="anonymous">\n</head>',
    );
  } else if (route === "/schedule") {
    updatedHtml = updatedHtml.replace(
      "</head>",
      '  <!-- Non-critical route data: use prefetch instead of preload to avoid unused-preload warnings -->\n  <link rel="prefetch" href="./assets/events.json" as="fetch" crossorigin="anonymous">\n</head>',
    );
  }

  return updatedHtml;
}

// Generate static files for each route
routes.forEach((route) => {
  const html = generateStaticHTML(route);

  // Create directory if it doesn't exist
  const outputDir = route === "/" ? "dist" : `dist${route}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write HTML file
  const outputPath =
    route === "/" ? "dist/index.html" : `dist${route}/index.html`;
  fs.writeFileSync(outputPath, html);

  console.log(`Generated: ${outputPath}`);
});

// Generate sponsor detail pages
sponsorRoutes.forEach((route) => {
  const html = generateStaticHTML(route);

  // Create directory if it doesn't exist
  const outputDir = `dist${route}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write HTML file
  const outputPath = `dist${route}/index.html`;
  fs.writeFileSync(outputPath, html);

  console.log(`Generated: ${outputPath}`);
});

// Generate sitemap
try {
  execSync("node scripts/generate-sitemap.js", { stdio: "inherit" });
} catch (error) {
  console.error("Failed to generate sitemap:", error.message);
}

console.log("Static site generation completed!");
