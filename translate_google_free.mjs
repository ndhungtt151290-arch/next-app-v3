import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';

const BASE = 'C:\\Users\\thuy\\OneDrive\\Máy tính\\next-app-v3';
const OUTPUT_FILE = path.join(BASE, 'need_translate.txt');

async function translateText(text, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await translate(text, { from: 'ja', to: 'vi' });
      return result.text;
    } catch (err) {
      console.error(`  Error: ${err.message.slice(0, 50)}`);
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 3000 * (i + 1)));
      }
    }
  }
  return text;
}

async function main() {
  console.log('Reading need_translate.txt...');
  const text = fs.readFileSync(OUTPUT_FILE, 'utf-8');
  const lines = text.split('\n');
  
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  let fixed = 0;
  let total = 0;
  
  // Count entries needing translation
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if ((line.startsWith('SIMPLE|') || line.startsWith('DSGSUB|')) && 
        i + 1 < lines.length && 
        lines[i + 1].trim().startsWith('TEXT||')) {
      const text = lines[i + 1].substring('TEXT||'.length);
      if (japanesePattern.test(text)) {
        total++;
      }
    }
  }
  
  console.log(`Found ${total} entries that need translation`);
  
  // Translate
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if ((line.startsWith('SIMPLE|') || line.startsWith('DSGSUB|')) && 
        i + 1 < lines.length && 
        lines[i + 1].trim().startsWith('TEXT||')) {
      const text = lines[i + 1].substring('TEXT||'.length);
      if (japanesePattern.test(text)) {
        process.stdout.write(`\r${fixed + 1}/${total}...`);
        const translated = await translateText(text);
        lines[i + 1] = 'TEXT||' + translated;
        fixed++;
        
        // Delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }
  
  console.log(`\nWriting fixed file...`);
  fs.writeFileSync(OUTPUT_FILE, '\ufeff' + lines.join('\n'), 'utf-8');
  console.log(`Done! Fixed ${fixed} entries.`);
}

main().catch(console.error);
