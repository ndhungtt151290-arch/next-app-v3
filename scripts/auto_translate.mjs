// Auto batch translate - translates remaining items automatically
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDCJVhISEFQw9ELEb6dNo9DDha_RFM3XBg' });

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

// Translate in batches
const BATCH_SIZE = 10;
const DELAY_MS = 2000;

for (let i = 0; i < missing.length; i += BATCH_SIZE) {
  const batch = missing.slice(i, i + BATCH_SIZE);
  console.log(`\n--- Batch ${Math.floor(i / BATCH_SIZE) + 1}: câu ${i + 1}-${i + batch.length} ---`);

  const prompt = `Dịch sang tiếng Việt (chỉ viết bản dịch, mỗi câu một dòng, không số thứ tự, không giải thích):
${batch.map((b, idx) => `${idx + 1}. ${b.explanation}`).join('\n')}`;

  try {
    const r = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { maxOutputTokens: 2000, temperature: 0.3 }
    });

    const text = r.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const lines = text.split('\n').map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).filter(l => l);

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
        console.log(`  ✓ ${b.id}: ${lines[idx].slice(0, 60)}...`);
      }
    });
  } catch (err) {
    console.error('  Lỗi API:', err.message);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  if (i + BATCH_SIZE < missing.length) {
    await new Promise(r => setTimeout(r, DELAY_MS));
  }
}

console.log('\n=== HOÀN THÀNH ===');
