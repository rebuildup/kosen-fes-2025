import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

const WORKSPACE = process.cwd();
const XLSX_PATH = path.resolve(
  WORKSPACE,
  "temp/高専祭バンド タイムテーブル.xlsx",
);
const EVENTS_JSON = path.resolve(WORKSPACE, "src/data/events.json");

function normalize(s) {
  return String(s ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
}

function pickIntroColumn(headers) {
  const introCandidates = [
    "紹介",
    "紹介文",
    "説明",
    "メンバー紹介",
    "バンド紹介",
    "description",
  ];
  for (let i = 0; i < headers.length; i++) {
    const h = normalize(headers[i]);
    if (introCandidates.some((k) => h.includes(k))) return i;
  }
  // フォールバック: 最も長文になりがちな列を推定
  return -1;
}

function pickTitleColumn(headers) {
  const titleCandidates = [
    "バンド名",
    "タイトル",
    "バンド",
    "名前",
    "band",
    "title",
    "name",
  ];
  for (let i = 0; i < headers.length; i++) {
    const h = normalize(headers[i]);
    if (titleCandidates.some((k) => h.includes(k))) return i;
  }
  return -1;
}

function rowsFromSheet(sheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  return json;
}

function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    console.error("XLSX not found:", XLSX_PATH);
    process.exit(1);
  }

  const bin = fs.readFileSync(XLSX_PATH);
  const wb = XLSX.read(bin, { type: "buffer" });
  const sheetNames = wb.SheetNames;

  // まずeventsから既知のバンド名集合を作る
  const events = JSON.parse(fs.readFileSync(EVENTS_JSON, "utf-8"));
  const bandTitles = new Set(
    events
      .filter((e) => typeof e?.id === "string" && e.id.startsWith("band-"))
      .map((e) => normalize(e.title)),
  );

  // 「バンド紹介」シートのみ対象
  const introSheets = sheetNames.filter((n) => /バンド紹介/.test(n));
  const introsByTitle = new Map();

  for (const name of introSheets) {
    const sh = wb.Sheets[name];
    const rows = rowsFromSheet(sh);
    if (!rows.length) continue;

    // 先頭がタイトル行（例: 出演バンド1日目）の場合はスキップ
    const startIdx = rows[0].some((c) => String(c).includes("出演バンド"))
      ? 1
      : 0;

    for (const row of rows.slice(startIdx)) {
      // 行内で最初に既知のバンド名と一致するセルをタイトルとして採用
      let titleIdx = -1;
      let title = "";
      for (let i = 0; i < row.length; i++) {
        const v = normalize(row[i]);
        if (v && bandTitles.has(v)) {
          titleIdx = i;
          title = v;
          break;
        }
      }
      if (titleIdx === -1) continue;

      // タイトル以降のセルを結合して紹介文にする（空セル除外）
      const parts = [];
      for (let j = titleIdx + 1; j < row.length; j++) {
        const t = normalize(row[j]);
        if (t) parts.push(t);
      }
      if (parts.length) {
        const intro = parts.join(" / ");
        introsByTitle.set(title, intro);
      }
    }
  }

  let updated = 0;
  for (const ev of events) {
    if (typeof ev?.id === "string" && ev.id.startsWith("band-")) {
      const t = normalize(ev.title);
      const intro = introsByTitle.get(t);
      if (intro) {
        ev.description = intro;
        updated++;
      }
    }
  }

  fs.writeFileSync(EVENTS_JSON, JSON.stringify(events, null, 2), "utf-8");
  console.log(`Updated introductions for ${updated} bands from XLSX.`);
}

main();
