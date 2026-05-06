import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'AIzaSyDCJVhISEFQw9ELEb6dNo9DDha_RFM3XBg' });
const r = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Dịch sang tiếng Việt (chỉ viết bản dịch, không giải thích): "前方不注意"',
  config: { maxOutputTokens: 500, temperature: 0.3 }
});
console.log('candidates:', JSON.stringify(r.candidates, null, 2));
console.log('sdkHttpResponse:', JSON.stringify(r.sdkHttpResponse?.json, (k,v) => v === undefined ? undefined : v, 2)?.slice(0, 500));
