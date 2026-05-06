/**
 * Batch translation script using Gemini API (v2).
 * Translates Japanese → Vietnamese for exam questions.
 * Usage:
 *   node scripts/batch-translate.mjs <batch_size> <target>
 *
 * Targets:
 *   explanationVi-simple    - simple[] explanationVi (634 missing)
 *   textVi-exam            - simpleForExam[] textVi (2 missing)
 *   stemVi-scenario       - scenarioGroups[] stemVi (68 missing)
 *   stemVi-danger         - dangerScenarioGroups[] stemVi (30 missing)
 *   textVi-scenario-subs   - scenarioGroups subs textVi (206 missing)
 *   textVi-danger-subs     - dangerScenarioGroups subs textVi (88 missing)
 *
 * Requires GEMINI_API_KEY in .env
 */
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../app/data/questions.vi.json');
const BATCH_SIZE = parseInt(process.argv[2] || '20', 10);
const TARGET = process.argv[3] || 'explanationVi-simple';

// Load API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY not set in .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// ── Build prompt ──────────────────────────────────────────────────────
function buildPrompt(items, field) {
  const srcField = field === 'explanationVi' ? 'explanation' : 'text';

  // Group items into batches of 25 for the prompt to keep responses short
  const promptItems = items.map((item, i) => ({
    n: i + 1,
    id: item.id || item.subKey || '',
    src: item[srcField],
  }));

  // Ask for JSON array for reliable parsing
  return `Bạn là dịch giả chuyên nghiệp cho đề thi bằng lái xe Nhật Bản.

Nhiệm vụ: Dịch từ tiếng Nhật sang tiếng Việt.

YÊU CẦU:
- Dịch tự nhiên, chuyên nghiệp, dễ hiểu cho người Việt
- Thuật ngữ giao thông: dùng "Đúng" cho ○, "Sai" cho ×
- Giữ nguyên các ký hiệu ○ × trong bản dịch
- CHỈ trả về JSON array, không giải thích gì thêm
- Format: [ {"n":1,"vi":"bản dịch"}, {"n":2,"vi":"bản dịch"}, ... ]

Input (${promptItems.length} items):
${promptItems.map(p => `${p.n}. JP: "${p.src.replace(/"/g, '\\"')}"`).join('\n')}

JSON array (chỉ có mảng, không có gì khác):`;
}

function parseResponse(responseText, expectedCount) {
  // Try to extract JSON array from response
  let text = responseText.trim();

  // Remove markdown code blocks
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*$/i, '').replace(/```$/i, '').trim();

  // Find array boundaries
  const arrStart = text.indexOf('[');
  const arrEnd = text.lastIndexOf(']');
  if (arrStart === -1 || arrEnd === -1) {
    console.error('  Parse error: no JSON array found');
    return [];
  }

  try {
    const arr = JSON.parse(text.slice(arrStart, arrEnd + 1));
    if (!Array.isArray(arr)) {
      console.error('  Parse error: response is not an array');
      return [];
    }
    return arr;
  } catch (e) {
    console.error('  JSON parse error:', e.message);
    console.error('  Raw (first 300):', text.slice(0, 300));
    return [];
  }
}

// ── Translate one batch with retry ──────────────────────────────────
async function translateBatch(items, field, batchNum) {
  const prompt = buildPrompt(items, field);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          maxOutputTokens: 4096,
          temperature: 0.3,
        }
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text.trim()) {
        throw new Error('Empty response');
      }

      return parseResponse(text, items.length);
    } catch (err) {
      const wait = (attempt + 1) * 5;
      console.error(`  Attempt ${attempt + 1} failed: ${err.message}. Retry in ${wait}s...`);
      await new Promise(r => setTimeout(r, wait * 1000));
    }
  }
  return [];
}

// ── Apply translations ────────────────────────────────────────────────
function applyResults(data, results, items, target, field) {
  let applied = 0;

  for (const r of results) {
    const idx = r.n - 1;
    if (idx < 0 || idx >= items.length) continue;
    const item = items[idx];
    const vi = r.vi?.trim();
    if (!vi) continue;

    if (target === 'explanationVi-simple') {
      const qi = data.simple.findIndex(q => q.id === item.id);
      if (qi !== -1) { data.simple[qi][field] = vi; applied++; }
    } else if (target === 'textVi-exam') {
      const qi = data.simpleForExam.findIndex(q => q.id === item.id);
      if (qi !== -1) { data.simpleForExam[qi][field] = vi; applied++; }
    } else if (target === 'stemVi-scenario') {
      const gi = data.scenarioGroups.findIndex(g => g.groupId === item.groupId);
      if (gi !== -1) { data.scenarioGroups[gi][field] = vi; applied++; }
    } else if (target === 'stemVi-danger') {
      const gi = data.dangerScenarioGroups.findIndex(g => g.groupId === item.groupId);
      if (gi !== -1) { data.dangerScenarioGroups[gi][field] = vi; applied++; }
    } else if (target === 'textVi-scenario-subs') {
      for (const g of data.scenarioGroups) {
        if (g.subs) {
          const si = g.subs.findIndex(s => s.subKey === item.subKey && s.partId === item.partId);
          if (si !== -1) { g.subs[si][field] = vi; applied++; break; }
        }
      }
    } else if (target === 'textVi-danger-subs') {
      for (const g of data.dangerScenarioGroups) {
        if (g.subs) {
          const si = g.subs.findIndex(s => s.subKey === item.subKey && s.partId === item.partId);
          if (si !== -1) { g.subs[si][field] = vi; applied++; break; }
        }
      }
    }
  }
  return applied;
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n=== Batch Translate ===`);
  console.log(`Target : ${TARGET}`);
  console.log(`Batch  : ${BATCH_SIZE}\n`);

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  // Collect items to translate
  let items = [];
  let field = '';

  if (TARGET === 'explanationVi-simple') {
    items = data.simple.filter(q => !q.explanationVi || q.explanationVi.trim() === '').map(q => ({ id: q.id, explanation: q.explanation }));
    field = 'explanationVi';
  } else if (TARGET === 'textVi-exam') {
    items = data.simpleForExam.filter(q => !q.textVi || q.textVi.trim() === '').map(q => ({ id: q.id, text: q.text }));
    field = 'textVi';
  } else if (TARGET === 'stemVi-scenario') {
    items = data.scenarioGroups.filter(g => !g.stemVi || g.stemVi.trim() === '').map(g => ({ groupId: g.groupId, text: g.stem }));
    field = 'stemVi';
  } else if (TARGET === 'stemVi-danger') {
    items = data.dangerScenarioGroups.filter(g => !g.stemVi || g.stemVi.trim() === '').map(g => ({ groupId: g.groupId, text: g.stem }));
    field = 'stemVi';
  } else if (TARGET === 'textVi-scenario-subs') {
    for (const g of data.scenarioGroups) {
      if (g.subs) {
        for (const s of g.subs) {
          if (!s.textVi || s.textVi.trim() === '') {
            items.push({ subKey: s.subKey, partId: s.partId, text: s.text });
          }
        }
      }
    }
    field = 'textVi';
  } else if (TARGET === 'textVi-danger-subs') {
    for (const g of data.dangerScenarioGroups) {
      if (g.subs) {
        for (const s of g.subs) {
          if (!s.textVi || s.textVi.trim() === '') {
            items.push({ subKey: s.subKey, partId: s.partId, text: s.text });
          }
        }
      }
    }
    field = 'textVi';
  }

  console.log(`Total items: ${items.length}`);
  console.log(`Field: ${field}\n`);

  if (items.length === 0) {
    console.log('Nothing to translate!');
    return;
  }

  let totalBatches = Math.ceil(items.length / BATCH_SIZE);
  let totalApplied = 0;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batch = items.slice(i, i + BATCH_SIZE);

    console.log(`[${batchNum}/${totalBatches}] Translating batch of ${batch.length}...`);

    const results = await translateBatch(batch, field, batchNum);
    console.log(`  Got ${results.length} translations`);

    const applied = applyResults(data, results, batch, TARGET, field);
    console.log(`  Applied ${applied} to file`);

    totalApplied += applied;

    // Save after each batch
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  Saved! (${totalApplied} total so far)\n`);

    // Rate limit: 1s between batches
    if (i + BATCH_SIZE < items.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Final count
  let remaining = 0;
  if (TARGET === 'explanationVi-simple') {
    remaining = data.simple.filter(q => !q.explanationVi || q.explanationVi.trim() === '').length;
  } else if (TARGET === 'textVi-exam') {
    remaining = data.simpleForExam.filter(q => !q.textVi || q.textVi.trim() === '').length;
  } else if (TARGET === 'stemVi-scenario') {
    remaining = data.scenarioGroups.filter(g => !g.stemVi || g.stemVi.trim() === '').length;
  } else if (TARGET === 'stemVi-danger') {
    remaining = data.dangerScenarioGroups.filter(g => !g.stemVi || g.stemVi.trim() === '').length;
  } else if (TARGET === 'textVi-scenario-subs') {
    remaining = data.scenarioGroups.reduce((n, g) => n + (g.subs?.filter(s => !s.textVi || s.textVi.trim() === '').length || 0), 0);
  } else if (TARGET === 'textVi-danger-subs') {
    remaining = data.dangerScenarioGroups.reduce((n, g) => n + (g.subs?.filter(s => !s.textVi || s.textVi.trim() === '').length || 0), 0);
  }

  console.log(`\n=== Done ===`);
  console.log(`Applied: ${totalApplied}`);
  console.log(`Remaining: ${remaining}`);
  console.log(`File: ${DATA_FILE}`);
}

main().catch(err => { console.error(err); process.exit(1); });
