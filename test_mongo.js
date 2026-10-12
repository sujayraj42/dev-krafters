const { MongoClient } = require('mongodb');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

// Try loading .env or .env.local if available without requiring dotenv package
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(__dirname, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const [k, ...v] = trimmed.split('=');
        if (k && v.length) {
          const val = v.join('=').replace(/^["']|["']$/g, '');
          if (!process.env[k.trim()]) {
            process.env[k.trim()] = val.trim();
          }
        }
      });
      break;
    }
  }
}

loadEnv();

// Fix Windows DNS SRV lookup issues for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const uri = process.env.MONGODB_URI;

if (!uri || uri.includes('<username>') || uri.includes('<db_password>')) {
  console.error('ERROR: MONGODB_URI is not set in environment or contains placeholder values.');
  console.error('Please configure MONGODB_URI in .env or set it before running this script.');
  process.exit(1);
}

async function testConnection() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    const dbName = process.env.MONGODB_DB || 'Dev_Krafters';
    const db = client.db(dbName);
    const count = await db.collection('leads').countDocuments();
    console.log(`Connected to database '${dbName}'. Total leads in DB:`, count);
  } catch (error) {
    console.error('ERROR CONNECTING TO MONGODB:', error.message || error);
  } finally {
    await client.close();
  }
}

testConnection();
