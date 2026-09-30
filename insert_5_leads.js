const { MongoClient } = require('mongodb');
const { configureDns } = require('./src/lib/dns-config');

// Ensure DNS SRV record resolution succeeds across environments
configureDns();

const uri = "mongodb+srv://sujayraj7003:abcd@cluster0.qfy0wqt.mongodb.net/Dev_Krafters?retryWrites=true&w=majority&appName=Cluster0";

async function insert5Leads() {
  console.log("Connecting to MongoDB Atlas Cluster0...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    const db = client.db('Dev_Krafters');

    const sampleLeads = [
      {
        type: 'contact',
        name: 'Dr. Anita Verma',
        email: 'anita@smiledental.com',
        phone: '+91 98765 43210',
        projectType: 'Business Website (₹25,000)',
        budget: '₹25,000 – ₹50,000',
        message: 'Need a custom 6-page website with online appointment booking for my dental clinic in Patna.',
        date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        createdAt: new Date()
      },
      {
        type: 'contact',
        name: 'Vikram Singh',
        email: 'vikram@royalbistro.in',
        phone: '+91 91234 56789',
        projectType: 'Landing Page (₹12,000)',
        budget: '₹10,000 – ₹20,000',
        message: 'Looking for a high-converting digital menu & table reservation landing page for bistro.',
        date: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        createdAt: new Date()
      },
      {
        type: 'newsletter',
        email: 'rahul.mehta99@gmail.com',
        date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        createdAt: new Date()
      },
      {
        type: 'estimate',
        projectType: 'E-Commerce Store',
        pages: 10,
        totalEstimateFormatted: '₹45,000',
        totalEstimateInr: 45000,
        email: 'quote.calculator@devkrafters.com',
        date: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        createdAt: new Date()
      },
      {
        type: 'chatbot',
        name: 'Priya Sharma (AI Chat)',
        email: 'priya@sareestudio.com',
        message: 'Can you build an online catalog for my saree studio with WhatsApp quick order button?',
        projectType: 'Captured via AI Chatbot',
        date: new Date().toISOString(),
        createdAt: new Date()
      }
    ];

    const result = await db.collection('leads').insertMany(sampleLeads);
    console.log(`SUCCESS: Inserted ${result.insertedCount} leads into 'dev_krafters.leads' collection!`);

    const count = await db.collection('leads').countDocuments();
    console.log(`Total Document Count in 'dev_krafters' DB: ${count}`);
  } catch (error) {
    console.error("ERROR INSERTING TO MONGODB:", error.message || error);
  } finally {
    await client.close();
  }
}

insert5Leads();
