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
  return saveLead(lead);
}

export function clearLeads(): void {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export async function clearLeadsAsync(): Promise<void> {
  clearLeads();
}
