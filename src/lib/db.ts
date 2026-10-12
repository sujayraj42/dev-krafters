// ═══════════════════════════════════════════════════════════════
// DEV KRAFTERS — Cloud Database Layer (100% MongoDB Atlas)
// ═══════════════════════════════════════════════════════════════
// Fully serverless-compatible (Vercel, Node runtime)
// Direct MongoDB Atlas connection with proper error propagation.

import { ObjectId } from 'mongodb';

export interface LeadRecord {
  id: string;
  type: 'contact' | 'newsletter' | 'estimate' | 'chatbot' | string;
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  pages?: number;
  budget?: string;
  totalEstimateFormatted?: string;
  totalEstimateInr?: number;
  message?: string;
  fileUrl?: string;
  date: string;
  status?: 'new' | 'in_progress' | 'converted' | string;
  notes?: string;
}

// ─────────────────────────────────────────────
// MONGODB ATLAS CONNECTION HELPER
// ─────────────────────────────────────────────
async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('<db_password>')) {
    throw new Error(
      'MONGODB_URI is not configured with valid credentials in environment variables.'
    );
  }

  const clientPromise = (await import('@/lib/mongodb')).default;
  if (!clientPromise) {
    throw new Error('MongoDB client failed to initialize. Check MONGODB_URI.');
  }

  const client = await Promise.race([
    clientPromise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB connection timeout (5s)')), 5000)
    ),
  ]);

  const dbName = process.env.MONGODB_DB || 'Dev_Krafters';
  return client.db(dbName);
}

// ─────────────────────────────────────────────
// GET ALL LEADS
// ─────────────────────────────────────────────
export async function getAllLeadsAsync(): Promise<LeadRecord[]> {
  const db = await getMongoDb();
  const docs = await db
    .collection('leads')
    .find({})
    .sort({ date: -1 })
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    type: doc.type || 'contact',
    name: doc.name || undefined,
    email: doc.email || undefined,
    phone: doc.phone || undefined,
    projectType: doc.projectType || undefined,
    pages: doc.pages || undefined,
    budget: doc.budget || undefined,
    totalEstimateFormatted: doc.totalEstimateFormatted || undefined,
    totalEstimateInr: doc.totalEstimateInr || undefined,
    message: doc.message || undefined,
    fileUrl: doc.fileUrl || undefined,
    status: doc.status || 'new',
    notes: doc.notes || undefined,
    date:
      typeof doc.date === 'string'
        ? doc.date
        : new Date(doc.date).toISOString(),
  }));
}

// ─────────────────────────────────────────────
// SAVE A SINGLE LEAD
// ─────────────────────────────────────────────
export async function saveLeadAsync(
  lead: Omit<LeadRecord, 'id' | 'date'> & { date?: string }
): Promise<LeadRecord> {
  const db = await getMongoDb();

  const newDoc = {
    ...lead,
    status: lead.status || 'new',
    date: lead.date || new Date().toISOString(),
    createdAt: new Date(),
  };

  const res = await db.collection('leads').insertOne(newDoc);

  return {
    ...newDoc,
    id: res.insertedId.toString(),
  };
}

// ─────────────────────────────────────────────
// UPDATE A LEAD (STATUS & NOTES)
// ─────────────────────────────────────────────
export async function updateLeadAsync(
  id: string,
  updates: { status?: string; notes?: string }
): Promise<boolean> {
  const db = await getMongoDb();
  let query: Record<string, unknown> = { _id: id };
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) };
  }

  const res = await db.collection('leads').updateOne(query, {
    $set: {
      ...updates,
      updatedAt: new Date(),
    },
  });

  return res.matchedCount > 0;
}

// ─────────────────────────────────────────────
// CLEAR ALL LEADS
// ─────────────────────────────────────────────
export async function clearLeadsAsync(): Promise<void> {
  const db = await getMongoDb();
  await db.collection('leads').deleteMany({});
}
