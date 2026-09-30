import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLocalLeads,
  saveLocalLead,
  clearLocalLeads,
  LEADS_STORAGE_KEY,
  ESTIMATES_STORAGE_KEY,
  LocalLead,
} from './leadsStorage';

// Mock localStorage implementation for Node environment
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

test('leadsStorage unit tests', async (t) => {
  // Set up global mock window & localStorage
  const mockStorage = new MockLocalStorage();
  (globalThis as any).window = {};
  (globalThis as any).localStorage = mockStorage;

  t.beforeEach(() => {
    mockStorage.clear();
  });

  await t.test('getLocalLeads returns empty array when storage is empty', () => {
    const leads = getLocalLeads();
    assert.deepEqual(leads, []);
  });

  await t.test('saveLocalLead stores lead in localStorage', () => {
    const newLead: LocalLead = {
      email: 'test@example.com',
      date: '2025-01-01T00:00:00.000Z',
      source: 'newsletter',
    };

    saveLocalLead(newLead);

    const leads = getLocalLeads();
    assert.equal(leads.length, 1);
    assert.deepEqual(leads[0], newLead);
  });

  await t.test('saveLocalLead prepends new leads', () => {
    const lead1: LocalLead = { email: 'lead1@example.com', date: '2025-01-01T00:00:00.000Z' };
    const lead2: LocalLead = { email: 'lead2@example.com', date: '2025-01-02T00:00:00.000Z' };

    saveLocalLead(lead1);
    saveLocalLead(lead2);

    const leads = getLocalLeads();
    assert.equal(leads.length, 2);
    assert.equal(leads[0].email, 'lead2@example.com');
    assert.equal(leads[1].email, 'lead1@example.com');
  });

  await t.test('clearLocalLeads removes leads and estimates from localStorage', () => {
    mockStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([{ email: 'test@example.com' }]));
    mockStorage.setItem(ESTIMATES_STORAGE_KEY, JSON.stringify([{ projectType: 'starter' }]));

    clearLocalLeads();

    assert.equal(mockStorage.getItem(LEADS_STORAGE_KEY), null);
    assert.equal(mockStorage.getItem(ESTIMATES_STORAGE_KEY), null);
  });
});
