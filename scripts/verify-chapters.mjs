/**
 * So khớp 章 trong data_*.txt với questions.json và CHAPTER_ORDER.
 * Chạy: node scripts/verify-chapters.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const CHAPTER_ORDER = [
  "運転の基礎知識",
  "道路の走行方法",
  "追い越し・駐停車",
  "標識・標示・信号",
  "危険な状況での運転",
  "総合演習1",
  "総合演習2",
  "総合演習3",
  "総合演習4",
  "総合演習5",
  "総合演習6【イラスト問題】",
  "危険予測【イラスト問題】",
];

function parseBlocks(text) {
  const parts = text.split(/\n-{10,}\n/);
  const blocks = [];
  for (const raw of parts) {
    const b = raw.trim();
    if (!b || (b.startsWith("#") && !b.includes("【問題"))) continue;
    if (!b.includes("【問題")) continue;
    blocks.push(b);
  }
  return blocks;
}

function parseBlockMeta(block) {
  const lines = block.split(/\r?\n/).map((l) => l.trimEnd());
  let id = "";
  let chapter = "";
  let section = "";
  for (const line of lines) {
    if (line.startsWith("ID:")) id = line.slice(3).trim();
    else if (line.startsWith("章:")) chapter = line.slice(3).trim();
    else if (line.startsWith("節:")) section = line.slice(3).trim();
  }
  return { id, chapter, section, lines };
}

const idToChapter = new Map();

for (let i = 1; i <= 5; i++) {
  const fp = path.join(root, `data_${i}.txt`);
  const text = fs.readFileSync(fp, "utf8");
  for (const block of parseBlocks(text)) {
    const { id, chapter } = parseBlockMeta(block);
    if (!id) continue;
    idToChapter.set(id, chapter);
  }
}

const json = JSON.parse(
  fs.readFileSync(path.join(root, "app", "data", "questions.json"), "utf8")
);

const orderSet = new Set(CHAPTER_ORDER);
const mismatches = [];
const missingInSource = [];
const unknownChaptersInData = new Set();

for (const [id, ch] of idToChapter) {
  if (!orderSet.has(ch)) unknownChaptersInData.add(ch);
}

for (const q of json.simple) {
  const src = idToChapter.get(q.id);
  if (src === undefined) missingInSource.push({ id: q.id, jsonChapter: q.chapter });
  else if (src !== q.chapter)
    mismatches.push({ id: q.id, json: q.chapter, source: src, kind: "simple" });
}

for (const g of json.scenarioGroups) {
  for (const sub of g.subs) {
    const src = idToChapter.get(sub.partId);
    if (src === undefined)
      missingInSource.push({ id: sub.partId, jsonChapter: g.chapter });
    else if (src !== g.chapter)
      mismatches.push({
        id: sub.partId,
        jsonGroupChapter: g.chapter,
        source: src,
        kind: "scenario-sub",
      });
  }
}

const jsonIds = new Set([
  ...json.simple.map((q) => q.id),
  ...json.scenarioGroups.flatMap((g) => g.subs.map((s) => s.partId)),
]);

const inSourceNotJson = [...idToChapter.keys()].filter((id) => !jsonIds.has(id));

console.log("--- Chương trong data nhưng không có trong CHAPTER_ORDER ---");
if (unknownChaptersInData.size === 0) console.log("(không có)");
else
  for (const c of [...unknownChaptersInData].sort())
    console.log(" ", JSON.stringify(c));

console.log("\n--- Sai lệch 章: JSON vs file nguồn (theo ID) ---");
console.log("count:", mismatches.length);
if (mismatches.length) console.log(mismatches.slice(0, 30));

console.log("\n--- ID có trong JSON nhưng không tìm thấy trong data ---");
console.log("count:", missingInSource.length);
if (missingInSource.length) console.log(missingInSource.slice(0, 20));

console.log("\n--- ID có trong data nhưng không có trong JSON ---");
console.log("count:", inSourceNotJson.length);
if (inSourceNotJson.length) console.log(inSourceNotJson.slice(0, 20));

/** Số block trong file nguồn tương đương JSON: simple = 1, mỗi ý scenario = 1 */
const byChapterJson = {};
for (const q of json.simple) {
  byChapterJson[q.chapter] = (byChapterJson[q.chapter] || 0) + 1;
}
for (const g of json.scenarioGroups) {
  byChapterJson[g.chapter] = (byChapterJson[g.chapter] || 0) + g.subs.length;
}

const byChapterSource = {};
for (const [, ch] of idToChapter) {
  byChapterSource[ch] = (byChapterSource[ch] || 0) + 1;
}

console.log("\n--- Số block câu hỏi theo 章: nguồn vs JSON ---");
for (const ch of CHAPTER_ORDER) {
  const a = byChapterSource[ch] ?? 0;
  const b = byChapterJson[ch] ?? 0;
  const ok = a === b ? "OK" : "DIFF";
  console.log(ok, ch, "source_blocks=", a, "json_items=", b);
}

const groupChapterMismatches = [];
for (const g of json.scenarioGroups) {
  const chapters = new Set(g.subs.map((s) => idToChapter.get(s.partId)));
  if (chapters.size > 1 || (chapters.size === 1 && !chapters.has(g.chapter))) {
    groupChapterMismatches.push({
      groupId: g.groupId,
      groupChapter: g.chapter,
      perPart: g.subs.map((s) => ({
        partId: s.partId,
        sourceChapter: idToChapter.get(s.partId),
      })),
    });
  }
}

console.log("\n--- Trong mỗi nhóm scenario, 3 ID có cùng 章 trong data ---");
console.log(
  "count:",
  groupChapterMismatches.length,
  groupChapterMismatches.length ? groupChapterMismatches.slice(0, 5) : "(OK)"
);

const exit =
  mismatches.length ||
  missingInSource.length ||
  groupChapterMismatches.length
    ? 1
    : 0;
process.exit(exit);
