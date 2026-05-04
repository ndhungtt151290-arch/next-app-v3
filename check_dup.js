const fs = require('fs');
const path = 'c:/Users/thuy/OneDrive/Máy tính/next-app-v3/app/data/questions.vi.json';
const outPath = 'c:/Users/thuy/OneDrive/Máy tính/next-app-v3/dup_result.txt';

const d = fs.readFileSync(path, 'utf8');
const j = JSON.parse(d);
const all = [...(j.simple||[]), ...(j.picture||[]), ...(j.sign||[]), ...(j.danger||[])];

const map = {};
all.forEach(q => {
  const k = (q.text||'') + '|||' + (q.answer||'');
  if (!map[k]) map[k] = [];
  map[k].push(q.id||'(no id)');
});

const dup = Object.entries(map).filter(([k,v]) => v.length > 1);
dup.sort((a,b) => b[1].length - a[1].length);

let out = '';
dup.forEach(([k,v]) => {
  const [text, ans] = k.split('|||');
  out += 'SL:' + v.length + ' | Dap an:' + ans + ' | Cau:' + text + '\n';
  out += '  ID: ' + v.join(', ') + '\n\n';
});

fs.writeFileSync(outPath, out, 'utf8');
console.log('Done. Total duplicate groups:', dup.length);
