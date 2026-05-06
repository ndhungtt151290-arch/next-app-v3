import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./app/data/questions.vi.json', 'utf8'));

let textViFixed = 0;
let explanationViFixed = 0;
let stemViFixed = 0;
let errors = 0;

async function translate(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=vi&dt=t&q=' + encodeURIComponent(text));
      const json = await response.json();
      if (json && json[0]) {
        return json[0].map(x => x[0]).join('');
      }
    } catch (e) {
      if (i < retries - 1) await new Promise(r => setTimeout(r, 1000));
    }
  }
  errors++;
  return null;
}

async function fixAll() {
  // Fix simpleForExam
  if (data.simpleForExam) {
    for (const q of data.simpleForExam) {
      if (q.textVi === null && q.text) {
        const result = await translate(q.text);
        if (result) {
          q.textVi = result;
          textViFixed++;
          console.log(`textVi: ${q.id}`);
        }
      }
    }
    fs.writeFileSync('./app/data/questions.vi.json', JSON.stringify(data, null, 2), 'utf8');
  }

  // Fix scenarioGroups
  if (data.scenarioGroups) {
    for (const group of data.scenarioGroups) {
      if (group.stemVi === null && group.stem) {
        const result = await translate(group.stem);
        if (result) {
          group.stemVi = result;
          stemViFixed++;
          console.log(`stemVi: ${group.groupId}`);
        }
      }

      if (group.subs) {
        for (const sub of group.subs) {
          if (sub.textVi === null && sub.text) {
            const result = await translate(sub.text);
            if (result) {
              sub.textVi = result;
              textViFixed++;
              console.log(`textVi: ${sub.partId}`);
            }
          }
          if (sub.explanationVi === null && sub.explanation) {
            const result = await translate(sub.explanation);
            if (result) {
              sub.explanationVi = result;
              explanationViFixed++;
              console.log(`explanationVi: ${sub.partId}`);
            }
          }
        }
      }
      fs.writeFileSync('./app/data/questions.vi.json', JSON.stringify(data, null, 2), 'utf8');
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\nDone! textVi: ${textViFixed}, explanationVi: ${explanationViFixed}, stemVi: ${stemViFixed}, errors: ${errors}`);
}

fixAll().catch(console.error);
