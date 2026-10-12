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

// Ensure DNS SRV record resolution succeeds on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const uri = process.env.MONGODB_URI;

if (!uri || uri.includes('<username>') || uri.includes('<db_password>')) {
  console.error('ERROR: MONGODB_URI is not set in environment or contains placeholder values.');
  console.error('Please configure MONGODB_URI in .env or set it before running this script.');
  process.exit(1);
}

async function insert5Leads() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    const dbName = process.env.MONGODB_DB || 'Dev_Krafters';
    const db = client.db(dbName);

    const sampleLeads = [
      {
        type: 'contact',
        name: 'Dr. Anita Verma',
        email: 'anita@smiledental.example',
        phone: '+91 98765 43210',
        projectType: 'Business Website (₹25,000)',
        budget: '₹25,000 – ₹50,000',
        message: 'Need a custom 6-page website with online appointment booking for my dental clinic in Patna.',
        date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        createdAt: new Date(),
      },
      {
        type: 'contact',
        name: 'Vikram Singh',
        email: 'vikram@royalbistro.example',
        phone: '+91 91234 56789',
        projectType: 'Landing Page (₹12,000)',
        budget: '₹10,000 – ₹20,000',
        message: 'Looking for a high-converting digital menu & table reservation landing page for bistro.',
        date: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        createdAt: new Date(),
      },
      {
        type: 'newsletter',
        email: 'rahul.mehta99@example.com',
        date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        createdAt: new Date(),
      },
      {
        type: 'estimate',
        name: 'Priya Sharma',
        email: 'priya@sharmafitness.example',
        phone: '+91 99887 76655',
        projectType: 'Fitness Studio Portal',
        pages: 5,
        totalEstimateFormatted: '₹25,000',
        totalEstimateInr: 25000,
        date: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        createdAt: new Date(),
      },
      {
        type: 'chatbot',
        name: 'Amit Patel',
        email: 'amit@patellogistics.example',
        phone: '+91 98112 23344',
        message: 'Inquired about supply chain tracking web portal pricing via chatbot.',
        date: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
        createdAt: new Date(),
      },
    ];

    const result = await db.collection('leads').insertMany(sampleLeads);
    console.log(`Inserted ${result.insertedCount} sample leads into collection 'leads'.`);
  } catch (error) {
    console.error('ERROR INSERTING SAMPLE LEADS:', error.message || error);
  } finally {
    await client.close();
  }
}

insert5Leads();
