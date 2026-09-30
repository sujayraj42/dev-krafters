export interface LocalLead {
  email?: string;
  projectType?: string;
  pages?: number;
  totalEstimate?: number;
  date: string;
  source?: string;
  type?: string;
}

export const LEADS_STORAGE_KEY = 'dev_krafters_leads';
export const ESTIMATES_STORAGE_KEY = 'dev_krafters_estimates';

/**
 * Retrieves saved local leads from localStorage safely.
 */
export function getLocalLeads(): LocalLead[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(LEADS_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Failed to parse local leads from storage:', error);
    return [];
  }
}

/**
 * Saves a new lead to localStorage safely for offline access.
 */
export function saveLocalLead(lead: LocalLead): void {
  if (typeof window === 'undefined') return;
  try {
    const leads = getLocalLeads();
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([lead, ...leads]));
  } catch (error) {
    console.error('Failed to save local lead to storage:', error);
  }
}

/**
 * Clears saved local leads and estimates from localStorage.
 */
export function clearLocalLeads(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEADS_STORAGE_KEY);
    localStorage.removeItem(ESTIMATES_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear local leads storage:', error);
  }
}
