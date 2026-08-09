import fs from 'fs';
import path from 'path';

export interface LeadRecord {
  id: string;
  type: 'contact' | 'newsletter' | 'estimate' | string;
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

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'leads_db.json');

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData: LeadRecord[] = [
      {
        id: 'lead-1',
        type: 'contact',
        name: 'Dr. Anita Joshi',
        email: 'anita@smiledental.com',
        phone: '+91 98765 43210',
        projectType: 'Business Website (₹25,000)',
        budget: '₹25,000 – ₹75,000',
        message: 'Need a custom website for my dental clinic.',
        date: new Date().toISOString(),
      },
      {
        id: 'lead-2',
        type: 'newsletter',
        email: 'rahul.mehta@spicecraft.in',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'lead-3',
        type: 'estimate',
        name: 'Calculator Lead',
        email: 'quote@client.com',
        projectType: 'E-commerce Store',
        pages: 10,
        totalEstimateFormatted: '₹75,000',
        totalEstimateInr: 75000,
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// ─────────────────────────────────────────────
// MONGODB ATLAS CLOUD DB INTEGRATION
// ─────────────────────────────────────────────
async function getMongoLeads(): Promise<LeadRecord[] | null> {
  if (!process.env.MONGODB_URI) return null;
  try {
    const clientPromise = (await import('@/lib/mongodb')).default;
    if (!clientPromise) return null;
    const client = await clientPromise;
    const db = client.db('dev_krafters');
    const docs = await db.collection('leads').find({}).sort({ date: -1 }).toArray();

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
      date: typeof doc.date === 'string' ? doc.date : new Date(doc.date).toISOString(),
    }));
  } catch (error) {
    console.error('[MongoDB Fetch Error]', error);
    return null;
  }
}

async function saveMongoLead(lead: Omit<LeadRecord, 'id' | 'date'> & { date?: string }): Promise<LeadRecord | null> {
  if (!process.env.MONGODB_URI) return null;
  try {
    const clientPromise = (await import('@/lib/mongodb')).default;
    if (!clientPromise) return null;
    const client = await clientPromise;
    const db = client.db('dev_krafters');

    const newDoc = {
      ...lead,
      date: lead.date || new Date().toISOString(),
      createdAt: new Date(),
    };

    const res = await db.collection('leads').insertOne(newDoc);
    return {
      ...newDoc,
      id: res.insertedId.toString(),
    };
  } catch (error) {
    console.error('[MongoDB Save Error]', error);
    return null;
  }
}

async function clearMongoLeads(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  try {
    const clientPromise = (await import('@/lib/mongodb')).default;
    if (!clientPromise) return false;
    const client = await clientPromise;
    const db = client.db('dev_krafters');
    await db.collection('leads').deleteMany({});
    return true;
  } catch (error) {
    console.error('[MongoDB Clear Error]', error);
    return false;
  }
}

// ─────────────────────────────────────────────
// PUBLIC EXPORTED FUNCTIONS WITH MONGO + LOCAL FALLBACK
// ─────────────────────────────────────────────
export function getAllLeads(): LeadRecord[] {
  ensureDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as LeadRecord[];
  } catch {
    return [];
  }
}

export async function getAllLeadsAsync(): Promise<LeadRecord[]> {
  const mongoLeads = await getMongoLeads();
  if (mongoLeads && mongoLeads.length > 0) {
    return mongoLeads;
  }
  return getAllLeads();
}

export function saveLead(lead: Omit<LeadRecord, 'id' | 'date'> & { date?: string }): LeadRecord {
  ensureDb();
  const leads = getAllLeads();

  const newRecord: LeadRecord = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    date: lead.date || new Date().toISOString(),
  };

  const updatedLeads = [newRecord, ...leads];
  fs.writeFileSync(DB_FILE, JSON.stringify(updatedLeads, null, 2), 'utf-8');
  return newRecord;
}

export async function saveLeadAsync(
  lead: Omit<LeadRecord, 'id' | 'date'> & { date?: string }
): Promise<LeadRecord> {
  const savedMongo = await saveMongoLead(lead);
  if (savedMongo) {
    // Also mirror to local disk
    saveLead(lead);
    return savedMongo;
  }
  return saveLead(lead);
}

export function clearLeads(): void {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export async function clearLeadsAsync(): Promise<void> {
  await clearMongoLeads();
  clearLeads();
}
