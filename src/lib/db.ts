// ═══════════════════════════════════════════════════════════════
// DEV KRAFTERS — Cloud Database Layer (100% MongoDB Atlas)
// ═══════════════════════════════════════════════════════════════
// This module is fully serverless-compatible (Vercel, Render, etc.)
// NO filesystem (fs) operations — everything goes to MongoDB Atlas.

export interface LeadRecord {
  id: string;
  type: 'contact' | 'newsletter' | 'estimate' | 'chatbot' | string;
  name?: string;
  email: string;
  phone?: string;
  projectType?: string;
  pages?: number;
  budget?: string;
  totalEstimateFormatted?: string;
  totalEstimateInr?: number;
  message?: string;
  fileUrl?: string;
  date: string;
}

// ─────────────────────────────────────────────
// MONGODB ATLAS CONNECTION HELPER
// ─────────────────────────────────────────────
async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not configured. Add it to your Vercel Environment Variables.'
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

  return client.db('dev_krafters');
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
      email: doc.email || '',
      phone: doc.phone || undefined,
      projectType: doc.projectType || undefined,
      pages: doc.pages || undefined,
      budget: doc.budget || undefined,
      totalEstimateFormatted: doc.totalEstimateFormatted || undefined,
      totalEstimateInr: doc.totalEstimateInr || undefined,
      message: doc.message || undefined,
      fileUrl: doc.fileUrl || undefined,
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
      date: lead.date || new Date().toISOString(),
      createdAt: new Date(),
    };

    const res = await db.collection('leads').insertOne(newDoc);

    return {
      ...newDoc,
      id: res.insertedId.toString(),
      email: newDoc.email || '',
    };
  } catch (error) {
    console.error(
      '[MongoDB Save Error]',
      error instanceof Error ? error.message : error
    );
    // Return a fallback record so the API doesn't crash
    return {
      ...lead,
      id: `fallback_${Date.now()}`,
      type: lead.type || 'contact',
      email: lead.email || '',
      date: lead.date || new Date().toISOString(),
    };
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

// ─────────────────────────────────────────────
// LEGACY SYNC WRAPPERS (for backward compatibility)
// These now just log warnings — real saving goes through async
// ─────────────────────────────────────────────
export function getAllLeads(): LeadRecord[] {
  console.warn(
    '[db.ts] getAllLeads() sync called — use getAllLeadsAsync() instead. Returning empty array.'
  );
  return [];
}

export function saveLead(
  lead: Omit<LeadRecord, 'id' | 'date'> & { date?: string }
): LeadRecord {
  console.warn(
    '[db.ts] saveLead() sync called — use saveLeadAsync() instead. Queuing async save.'
  );
  // Fire-and-forget async save to MongoDB
  saveLeadAsync(lead).catch((err) =>
    console.error('[saveLead async fallback error]', err)
  );

  return {
    ...lead,
    id: `queued_${Date.now()}`,
    type: lead.type || 'contact',
    email: lead.email || '',
    date: lead.date || new Date().toISOString(),
  };
}

export function clearLeads(): void {
  console.warn(
    '[db.ts] clearLeads() sync called — use clearLeadsAsync() instead.'
  );
  clearLeadsAsync().catch((err) =>
    console.error('[clearLeads async fallback error]', err)
  );
}
