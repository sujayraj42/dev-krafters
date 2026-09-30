import { MongoClient } from 'mongodb';
import { configureDns } from './dns-config';

// Ensure DNS SRV record resolution succeeds across environments
configureDns();

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
};

let clientPromise: Promise<MongoClient> | undefined;

if (uri) {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.warn(
    '[MongoDB] MONGODB_URI is not configured. Add MONGODB_URI to your Vercel Environment Variables.'
  );
}

export default clientPromise;
