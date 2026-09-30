import test from 'node:test';
import assert from 'node:assert/strict';
import { saveLeadAsync, saveManyLeadsAsync, LeadRecord } from '../src/lib/db';

test('saveManyLeadsAsync inserts multiple leads', async (t) => {
  const mockLeads: (Omit<LeadRecord, 'id' | 'date'> & { date?: string })[] = [
    { type: 'contact', name: 'Lead 1', email: 'l1@test.com' },
    { type: 'contact', name: 'Lead 2', email: 'l2@test.com' },
    { type: 'newsletter', email: 'l3@test.com' },
    { type: 'estimate', name: 'Lead 4', email: 'l4@test.com' },
    { type: 'chatbot', name: 'Lead 5', email: 'l5@test.com' },
  ];

  // Benchmark function execution fallback path or db call
  const startSingle = performance.now();
  const singleResults = [];
  for (const lead of mockLeads) {
    singleResults.push(await saveLeadAsync(lead));
  }
  const endSingle = performance.now();
  const singleDuration = endSingle - startSingle;

  const startBulk = performance.now();
  const bulkResults = await saveManyLeadsAsync(mockLeads);
  const endBulk = performance.now();
  const bulkDuration = endBulk - startBulk;

  assert.equal(singleResults.length, 5);
  assert.equal(bulkResults.length, 5);
  assert.ok(Array.isArray(bulkResults));

  console.log(`[Benchmark DB Layer] 5 Single Inserts: ${singleDuration.toFixed(2)}ms vs Bulk Insert: ${bulkDuration.toFixed(2)}ms`);
});
