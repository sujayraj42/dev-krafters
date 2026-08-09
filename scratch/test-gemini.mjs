import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

// Read .env.local manually for test script
const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

console.log('Testing Gemini API Key:', apiKey ? `${apiKey.slice(0, 8)}...` : 'MISSING');

const modelsToTest = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

for (const model of modelsToTest) {
  try {
    console.log(`\n--- Testing model: ${model} ---`);
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: 'Hello, respond with 1 sentence.',
    });
    console.log(`SUCCESS [${model}]:`, response.text);
  } catch (err) {
    console.error(`ERROR [${model}]:`, err.message || err);
  }
}
