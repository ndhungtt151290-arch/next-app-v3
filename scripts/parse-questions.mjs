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

const SCENARIO_CHAPTERS = new Set([
  "危険予測【イラスト問題】",
  "総合演習6【イラスト問題】",
]);

function parseBlocks(text) {
  const parts = text.split(/\n-{10,}\n/);
  const blocks = [];
  for (const raw of parts) {
    const b = raw.trim();
    if (!b || b.startsWith("#") && !b.includes("【問題")) continue;
    if (!b.includes("【問題")) continue;
    blocks.push(b);
  }
  return blocks;
}

function parseBlock(block) {
  const lines = block.split(/\r?\n/).map((l) => l.trimEnd());
  let id = "";
  let chapter = "";
  let section = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("ID:")) id = line.slice(3).trim();
    else if (line.startsWith("章:")) chapter = line.slice(3).trim();
    else if (line.startsWith("節:")) section = line.slice(3).trim();
    i++;
  }

  const qIdx = lines.findIndex((l) => l.startsWith("問:"));
  if (qIdx === -1) return null;

  const brackIdx = lines.findIndex(
    (l, idx) => idx > qIdx && /^【[１２３123]】/.test(l)
  );

  if (brackIdx === -1) {
    const afterQ = lines.slice(qIdx).join("\n");
    const ansM = afterQ.match(/答:\s*([○×])/);
    const expM = afterQ.match(/解説:\s*(.+)/s);
    const imgM = afterQ.match(/画像:\s*(\S+)/);
    const qText = lines
      .slice(qIdx, lines.findIndex((l, idx) => idx > qIdx && l.startsWith("答:")))
      .map((l) => (l.startsWith("問:") ? l.slice(3).trim() : l))
      .filter(Boolean)
      .join("\n");
    if (!ansM) return null;
    return {
      kind: "simple",
      id,
      chapter,
      section,
      text: qText,
      answer: ansM[1],
      explanation: expM ? expM[1].trim().split("\n")[0] : "",
      image: imgM ? imgM[1].trim() : undefined,
    };
  }

  const stemLines = [];
  for (let j = qIdx; j < brackIdx; j++) {
    const l = lines[j];
    stemLines.push(l.startsWith("問:") ? l.slice(3).trim() : l.trim());
  }
  const stem = stemLines.filter(Boolean).join("\n");

  const subs = [];
  let k = brackIdx;
  while (k < lines.length) {
    const l = lines[k];
    const subM = l.match(/^【([１２３123])】\s*(.*)$/);
    if (!subM) {
      k++;
      continue;
    }
    const subKey = subM[1];
    let subText = subM[2] || "";
    k++;
    while (
      k < lines.length &&
      !lines[k].startsWith("答:") &&
      !/^【[１２３123]】/.test(lines[k])
    ) {
      if (lines[k].trim()) subText += (subText ? "\n" : "") + lines[k].trim();
      k++;
    }
    const ansLine = lines[k];
    if (!ansLine?.startsWith("答:")) break;
    const answer = ansLine.replace(/^答:\s*/, "").trim().charAt(0);
    k++;
    let explanation = "";
    let image;
    while (k < lines.length && !/^【[１２３123]】/.test(lines[k])) {
      if (lines[k].startsWith("解説:"))
        explanation = lines[k].slice(3).trim();
      else if (lines[k].startsWith("画像:"))
        image = lines[k].slice(3).trim();
      k++;
    }
    subs.push({ subKey, text: subText, answer, explanation, image });
  }

  if (subs.length === 0) return null;
  return {
    kind: "scenario",
    id,
    chapter,
    section,
    stem,
    subs,
  };
}

function groupKeyFromId(id) {
  const m = id.match(/gentsuki_(\d+)_(\d+)_(\d+)$/);
  if (!m) return null;
  return `${m[1]}_${m[2]}`;
}

function buildScenarioGroups(records) {
  const scenarios = [];
  const byChapter = new Map();
  for (const r of records) {
    if (r.kind !== "scenario") continue;
    if (!SCENARIO_CHAPTERS.has(r.chapter)) continue;
    const gk = groupKeyFromId(r.id);
    if (!gk) continue;
    const key = `${r.chapter}::${gk}`;
    if (!byChapter.has(key)) byChapter.set(key, []);
    byChapter.get(key).push(r);
  }
  for (const [, arr] of byChapter) {
    arr.sort((a, b) => a.id.localeCompare(b.id));
    if (arr.length !== 3) continue;
    const subs = [];
    for (const rec of arr) {
      if (!rec.subs?.[0]) break;
      const s = rec.subs[0];
      subs.push({
        subKey: s.subKey,
        text: s.text,
        answer: s.answer,
        explanation: s.explanation,
        image: s.image,
        partId: rec.id,
      });
    }
    if (subs.length !== 3) continue;
    const first = arr[0];
    scenarios.push({
      groupId: `${first.chapter}::${groupKeyFromId(first.id)}`,
      chapter: first.chapter,
      section: first.section,
      stem: first.stem,
      subs,
    });
  }
  return scenarios;
}

function main() {
  const simple = [];
  const rawScenarioParts = [];

  for (let i = 1; i <= 5; i++) {
    const fp = path.join(root, `data_${i}.txt`);
    const text = fs.readFileSync(fp, "utf8");
    for (const block of parseBlocks(text)) {
      const p = parseBlock(block);
      if (!p) continue;
      if (p.kind === "simple") simple.push(p);
      else rawScenarioParts.push(p);
    }
  }

  const scenariosFromData = buildScenarioGroups(rawScenarioParts);
  const dangerScenarios = scenariosFromData.filter(
    (g) => g.chapter === "危険予測【イラスト問題】"
  );

  const simpleForExam = simple.filter(
    (q) => !SCENARIO_CHAPTERS.has(q.chapter)
  );

  const out = {
    chapterOrder: CHAPTER_ORDER,
    simple,
    simpleForExam,
    scenarioGroups: scenariosFromData,
    dangerScenarioGroups: dangerScenarios,
  };

  const dir = path.join(root, "app", "data");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "questions.json"),
    JSON.stringify(out),
    "utf8"
  );
  console.log(
    "simple:",
    simple.length,
    "examSimplePool:",
    simpleForExam.length,
    "scenarioGroups:",
    scenariosFromData.length,
    "dangerOnly:",
    dangerScenarios.length
  );
}

main();
