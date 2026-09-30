import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { saveLeadAsync, getAllLeadsAsync, updateLeadAsync, clearLeadsAsync } from '@/lib/db';

describe('src/lib/db.ts - saveLeadAsync Fallback & Error Handling', () => {
  const originalEnv = process.env.MONGODB_URI;
  let consoleErrorOutput: string[] = [];
  const originalConsoleError = console.error;

  beforeEach(() => {
    consoleErrorOutput = [];
    console.error = (...args: unknown[]) => {
      consoleErrorOutput.push(args.map(a => (a instanceof Error ? a.message : String(a))).join(' '));
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
    if (originalEnv !== undefined) {
      process.env.MONGODB_URI = originalEnv;
    } else {
      delete process.env.MONGODB_URI;
    }
  });

  describe('saveLeadAsync fallback on database error', () => {
    it('returns a fallback lead record when MONGODB_URI is not set', async () => {
      delete process.env.MONGODB_URI;

      const leadData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Need a custom website',
      };

      const result = await saveLeadAsync(leadData);

      assert.ok(result.id.startsWith('fallback_'), 'ID should start with "fallback_"');
      assert.equal(result.name, 'Jane Doe');
      assert.equal(result.email, 'jane@example.com');
      assert.equal(result.message, 'Need a custom website');
      assert.equal(result.type, 'contact', 'Default type should be "contact"');
      assert.equal(result.status, 'new', 'Default status should be "new"');
      assert.ok(result.date, 'Date should be populated');
      assert.ok(!isNaN(Date.parse(result.date)), 'Date should be a valid ISO timestamp');

      assert.ok(
        consoleErrorOutput.some(msg => msg.includes('[MongoDB Save Error]')),
        'Error should be logged to console.error'
      );
    });

    it('returns a fallback lead record when MONGODB_URI contains placeholder <db_password>', async () => {
      process.env.MONGODB_URI = 'mongodb+srv://admin:<db_password>@cluster0.mongodb.net/test';

      const leadData = {
        type: 'estimate',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '123-456-7890',
        projectType: 'Web Development',
        budget: '$5,000 - $10,000',
        status: 'in_progress',
        date: '2025-01-15T10:00:00.000Z',
      };

      const result = await saveLeadAsync(leadData);

      assert.ok(result.id.startsWith('fallback_'), 'ID should start with "fallback_"');
      assert.equal(result.type, 'estimate');
      assert.equal(result.name, 'John Smith');
      assert.equal(result.email, 'john@example.com');
      assert.equal(result.phone, '123-456-7890');
      assert.equal(result.projectType, 'Web Development');
      assert.equal(result.budget, '$5,000 - $10,000');
      assert.equal(result.status, 'in_progress');
      assert.equal(result.date, '2025-01-15T10:00:00.000Z');

      assert.ok(
        consoleErrorOutput.some(msg =>
          msg.includes('[MongoDB Save Error]') && msg.includes('<db_password>')
        ),
        'Should log placeholder error'
      );
    });

    it('preserves custom type, status, and date in fallback output when provided', async () => {
      delete process.env.MONGODB_URI;

      const customLead = {
        type: 'newsletter',
        email: 'subscriber@example.com',
        status: 'converted',
        date: '2025-06-20T18:30:00.000Z',
      };

      const result = await saveLeadAsync(customLead);

      assert.ok(result.id.startsWith('fallback_'));
      assert.equal(result.type, 'newsletter');
      assert.equal(result.status, 'converted');
      assert.equal(result.date, '2025-06-20T18:30:00.000Z');
      assert.equal(result.email, 'subscriber@example.com');
    });
  });

  describe('Other database functions error fallback', () => {
    it('getAllLeadsAsync returns an empty array on error', async () => {
      delete process.env.MONGODB_URI;
      const leads = await getAllLeadsAsync();
      assert.deepEqual(leads, []);
      assert.ok(consoleErrorOutput.some(msg => msg.includes('[MongoDB Fetch Error]')));
    });

    it('updateLeadAsync returns false on error', async () => {
      delete process.env.MONGODB_URI;
      const success = await updateLeadAsync('lead_123', { status: 'converted' });
      assert.equal(success, false);
      assert.ok(consoleErrorOutput.some(msg => msg.includes('[MongoDB Update Error]')));
    });

    it('clearLeadsAsync handles database error without crashing', async () => {
      delete process.env.MONGODB_URI;
      await assert.doesNotReject(async () => {
        await clearLeadsAsync();
      });
      assert.ok(consoleErrorOutput.some(msg => msg.includes('[MongoDB Clear Error]')));
    });
  });
});
