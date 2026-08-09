import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

const ai = new GoogleGenAI({ apiKey });

const modelsToTest = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b'
];

for (const model of modelsToTest) {
  try {
    console.log(`Testing ${model}...`);
    const res = await ai.models.generateContent({
      model,
      contents: 'Hi',
    });
    console.log(`Success [${model}]:`, res.text);
  } catch (err) {
    console.log(`Error [${model}]:`, err.message?.slice(0, 150));
  }
}
