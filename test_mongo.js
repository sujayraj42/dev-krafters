const { MongoClient } = require('mongodb');
const dns = require('dns');

// Fix Windows DNS SRV lookup issues for MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = "mongodb+srv://sujayraj7003:abcd@cluster0.qfy0wqt.mongodb.net/dev_krafters?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    const db = client.db('dev_krafters');
    const count = await db.collection('leads').countDocuments();
    console.log("Total leads in DB:", count);
  } catch (error) {
    console.error("ERROR CONNECTING TO MONGODB:", error.message || error);
  } finally {
    await client.close();
  }
}

testConnection();
