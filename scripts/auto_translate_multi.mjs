// Auto batch translate with multiple models - rotates through models to avoid quota limits
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const MODELS = [
  { name: 'gemini-2.0-flash', key: 'AIzaSyDCJVhISEFQw9ELEb6dNo9DDha_RFM3XBg' },
];

const filePath = 'app/data/questions.vi.json';
const raw = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(raw);

function findAllMissing(obj, results = []) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if (item.id && item.explanationVi === null && item.explanation) {
          results.push({ id: item.id, explanation: item.explanation });
        }
      }
      findAllMissing(item, results);
    }
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      findAllMissing(obj[key], results);
    }
  }
  return results;
}

const missing = findAllMissing(data);
console.log(`Tổng số cần dịch: ${missing.length}`);

const BATCH_SIZE = 5;
const DELAY_MS = 3000;
let modelIdx = 0;

async function translateWithModel(modelIdx, batch) {
  const model = MODELS[modelIdx % MODELS.length];
  const ai = new GoogleGenAI({ apiKey: model.key });

  const prompt = `Dịch sang tiếng Việt (chỉ viết bản dịch, mỗi câu một dòng, không số thứ tự, không giải thích):
${batch.map((b, idx) => `${idx + 1}. ${b.explanation}`).join('\n')}`;

  const r = await ai.models.generateContent({
    model: model.name,
    contents: prompt,
    config: { maxOutputTokens: 1000, temperature: 0.3 }
  });

  const text = r.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.split('\n').map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).filter(l => l);
}

for (let i = 0; i < missing.length; i += BATCH_SIZE) {
  const batch = missing.slice(i, i + BATCH_SIZE);
  const modelName = MODELS[modelIdx % MODELS.length].name;
  console.log(`\n--- Batch ${Math.floor(i / BATCH_SIZE) + 1}: câu ${i + 1}-${i + batch.length} (model: ${modelName}) ---`);

  let lines = [];
  let success = false;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      lines = await translateWithModel(modelIdx, batch);
      if (lines.length > 0) {
        success = true;
        break;
      }
    } catch (err) {
      const errStr = err.message || '';
      if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
        console.log(`  Quota exceeded for ${modelName}, trying next model...`);
        modelIdx++;
        const nextModel = MODELS[modelIdx % MODELS.length];
        console.log(`  Switching to: ${nextModel.name}`);
      } else {
        console.error(`  Lỗi: ${errStr.slice(0, 200)}`);
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  if (success) {
    batch.forEach((b, idx) => {
      if (lines[idx]) {
        function updateItem(obj) {
          if (Array.isArray(obj)) {
            for (const item of obj) {
              if (item && typeof item === 'object' && !Array.isArray(item) && item.id === b.id) {
                item.explanationVi = lines[idx];
              }
              updateItem(item);
            }
          } else if (obj && typeof obj === 'object') {
            for (const key of Object.keys(obj)) updateItem(obj[key]);
          }
        }
        updateItem(data);
        console.log(`  ✓ ${b.id}: ${lines[idx].slice(0, 50)}...`);
      }
    });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } else {
    console.log(`  Skip batch due to errors`);
  }

  if (i + BATCH_SIZE < missing.length) {
    await new Promise(r => setTimeout(r, DELAY_MS));
  }
}

// Count remaining
function countRemaining(obj) {
  let cnt = 0;
  function count(obj) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (item && typeof item === 'object' && !Array.isArray(item) && item.explanationVi === null) cnt++;
        count(item);
      }
    } else if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) count(obj[key]);
    }
  }
  count(obj);
  return cnt;
}

console.log(`\n=== HOÀN THÀNH - Còn lại: ${countRemaining(data)} câu ===`);
