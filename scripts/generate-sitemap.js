#!/usr/bin/env node

/**
 * Generate sitemap.xml for the site
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL
const baseUrl = "https://www2.ube-k.ac.jp/fes2025";

// Current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Main routes
const mainRoutes = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/#/events", priority: "0.9", changefreq: "daily" },
  { url: "/#/exhibits", priority: "0.9", changefreq: "daily" },
  { url: "/#/schedule", priority: "0.9", changefreq: "daily" },
  { url: "/#/map", priority: "0.9", changefreq: "daily" },
  { url: "/#/search", priority: "0.8", changefreq: "daily" },
  { url: "/#/bookmarks", priority: "0.7", changefreq: "weekly" },
  { url: "/#/sponsors", priority: "0.6", changefreq: "weekly" },
  { url: "/#/content-submission", priority: "0.5", changefreq: "monthly" },
];

// Event detail pages
const eventRoutes = [];
for (let i = 1; i <= 14; i++) {
  eventRoutes.push({ url: `/#/detail/event/event-${i}`, priority: "0.8", changefreq: "weekly" });
}
for (let i = 1; i <= 23; i++) {
  eventRoutes.push({ url: `/#/detail/event/band-${i}`, priority: "0.8", changefreq: "weekly" });
}

// Exhibit detail pages
const exhibitRoutes = [];
for (let i = 1; i <= 13; i++) {
  exhibitRoutes.push({ url: `/#/detail/exhibit/exhibit-${i}`, priority: "0.8", changefreq: "weekly" });
}

// Stall detail pages
const stallRoutes = [];
const stallIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, "11-1", "11-2", 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
stallIds.forEach(id => {
  stallRoutes.push({ url: `/#/detail/stall/stall-${id}`, priority: "0.8", changefreq: "weekly" });
});

// Sponsor detail pages
const sponsorRoutes = [];
for (let i = 1; i <= 29; i++) {
  sponsorRoutes.push({ url: `/#/detail/sponsor/sponsor-${i}`, priority: "0.7", changefreq: "weekly" });
}

// Combine all routes
const allRoutes = [
  ...mainRoutes,
  ...eventRoutes,
  ...exhibitRoutes,
  ...stallRoutes,
  ...sponsorRoutes,
];

// Generate sitemap XML
function generateSitemap() {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allRoutes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${route.url}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>\n';

  return sitemap;
}

// Write sitemap to dist directory
const sitemapContent = generateSitemap();
const outputPath = path.join(__dirname, "../dist/sitemap.xml");

// Ensure dist directory exists
const distDir = path.join(__dirname, "../dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(outputPath, sitemapContent);
console.log(`Generated sitemap: ${outputPath}`);
console.log(`Total URLs: ${allRoutes.length}`);
