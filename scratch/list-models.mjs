import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

const ai = new GoogleGenAI({ apiKey });

console.log('Listing available models for API Key...');
try {
  const models = await ai.models.listModels();
  for await (const model of models) {
    console.log(`- ${model.name}`);
  }
} catch (e) {
  console.error('List models error:', e.message);
}
