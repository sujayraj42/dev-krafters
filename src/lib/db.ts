// ═══════════════════════════════════════════════════════════════
// DEV KRAFTERS — Cloud Database Layer (100% MongoDB Atlas)
// ═══════════════════════════════════════════════════════════════
// This module is fully serverless-compatible (Vercel, Render, etc.)
// NO filesystem (fs) operations — everything goes to MongoDB Atlas.

import { ObjectId } from 'mongodb';
import { configureDns } from './dns-config';

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
  configureDns();

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    throw new Error(
      'MONGODB_URI contains placeholder <db_password>. Please set your actual MongoDB Atlas password in Vercel Environment Variables.'
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
  try {
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
  } catch (error) {
    console.error(
      '[MongoDB Fetch Error]',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

// ─────────────────────────────────────────────
// SAVE A SINGLE LEAD
// ─────────────────────────────────────────────
export async function saveLeadAsync(
  lead: Omit<LeadRecord, 'id' | 'date'> & { date?: string }
): Promise<LeadRecord> {
  try {
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
  } catch (error) {
    console.error(
      '[MongoDB Save Error]',
      error instanceof Error ? error.message : error
    );
    return {
      ...lead,
      id: `fallback_${Date.now()}`,
      type: lead.type || 'contact',
      status: lead.status || 'new',
      date: lead.date || new Date().toISOString(),
    };
  }
}

// ─────────────────────────────────────────────
// UPDATE A LEAD (STATUS & NOTES)
// ─────────────────────────────────────────────
export async function updateLeadAsync(
  id: string,
  updates: { status?: string; notes?: string }
): Promise<boolean> {
  try {
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

    return res.modifiedCount > 0;
  } catch (error) {
    console.error(
      '[MongoDB Update Error]',
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

// ─────────────────────────────────────────────
// CLEAR ALL LEADS
// ─────────────────────────────────────────────
export async function clearLeadsAsync(): Promise<void> {
  try {
    const db = await getMongoDb();
    await db.collection('leads').deleteMany({});
  } catch (error) {
    console.error(
      '[MongoDB Clear Error]',
      error instanceof Error ? error.message : error
    );
  }
}
