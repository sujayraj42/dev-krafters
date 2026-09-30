import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { saveLeadAsync, type LeadRecord } from './db';
import { ObjectId } from 'mongodb';

// Define type for global with mongo client promise
type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<unknown>;
};

describe('saveLeadAsync', () => {
  const originalEnv = process.env.MONGODB_URI;
  const originalMongoPromise = (global as GlobalWithMongo)._mongoClientPromise;
  let insertedDocs: any[] = [];
  let shouldFailInsert = false;
  let shouldFailDb = false;

  const mockDb = {
    collection: (_name: string) => {
      if (shouldFailDb) {
        throw new Error('Database connection failed');
      }
      return {
        insertOne: async (doc: any) => {
          if (shouldFailInsert) {
            throw new Error('MongoDB insert failure');
          }
          insertedDocs.push(doc);
          return {
            insertedId: new ObjectId('65f1a2b3c4d5e6f7a8b9c0d1'),
          };
        },
      };
    },
  };

  const mockClient = {
    db: (_dbName?: string) => mockDb,
  };

  beforeEach(() => {
    insertedDocs = [];
    shouldFailInsert = false;
    shouldFailDb = false;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
    (global as GlobalWithMongo)._mongoClientPromise = Promise.resolve(mockClient);
  });

  afterEach(() => {
    process.env.MONGODB_URI = originalEnv;
    (global as GlobalWithMongo)._mongoClientPromise = originalMongoPromise;
  });

  test('saves lead with default status ("new") and generated date when not provided', async () => {
    const inputLead = {
      type: 'contact',
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello world',
    };

    const savedLead = await saveLeadAsync(inputLead);

    assert.equal(savedLead.id, '65f1a2b3c4d5e6f7a8b9c0d1');
    assert.equal(savedLead.name, 'Alice');
    assert.equal(savedLead.email, 'alice@example.com');
    assert.equal(savedLead.type, 'contact');
    assert.equal(savedLead.status, 'new');
    assert.ok(typeof savedLead.date === 'string');
    assert.ok(!isNaN(Date.parse(savedLead.date)));

    assert.equal(insertedDocs.length, 1);
    assert.equal(insertedDocs[0].name, 'Alice');
    assert.equal(insertedDocs[0].status, 'new');
    assert.ok(insertedDocs[0].createdAt instanceof Date);
  });

  test('saves lead with custom status, explicit date, and all optional fields', async () => {
    const customDate = '2025-02-20T12:00:00.000Z';
    const inputLead = {
      type: 'estimate',
      name: 'Bob',
      email: 'bob@example.com',
      phone: '+1234567890',
      projectType: 'E-commerce',
      pages: 10,
      budget: '$10,000',
      totalEstimateFormatted: '$10,000',
      totalEstimateInr: 800000,
      message: 'Need a full e-commerce solution',
      fileUrl: 'https://example.com/spec.pdf',
      status: 'in_progress',
      notes: 'High priority lead',
      date: customDate,
    };

    const savedLead = await saveLeadAsync(inputLead);

    assert.equal(savedLead.id, '65f1a2b3c4d5e6f7a8b9c0d1');
    assert.equal(savedLead.type, 'estimate');
    assert.equal(savedLead.status, 'in_progress');
    assert.equal(savedLead.date, customDate);
    assert.equal(savedLead.phone, '+1234567890');
    assert.equal(savedLead.projectType, 'E-commerce');
    assert.equal(savedLead.pages, 10);
    assert.equal(savedLead.budget, '$10,000');
    assert.equal(savedLead.totalEstimateFormatted, '$10,000');
    assert.equal(savedLead.totalEstimateInr, 800000);
    assert.equal(savedLead.fileUrl, 'https://example.com/spec.pdf');
    assert.equal(savedLead.notes, 'High priority lead');

    assert.equal(insertedDocs.length, 1);
    assert.equal(insertedDocs[0].status, 'in_progress');
    assert.equal(insertedDocs[0].date, customDate);
  });

  test('returns fallback lead record when insert throws an error', async () => {
    shouldFailInsert = true;

    const inputLead = {
      type: 'chatbot',
      name: 'Charlie',
      email: 'charlie@example.com',
    };

    const savedLead = await saveLeadAsync(inputLead);

    assert.ok(savedLead.id.startsWith('fallback_'));
    assert.equal(savedLead.type, 'chatbot');
    assert.equal(savedLead.name, 'Charlie');
    assert.equal(savedLead.status, 'new');
    assert.ok(typeof savedLead.date === 'string');
  });

  test('returns fallback lead record when getMongoDb fails due to missing uri', async () => {
    process.env.MONGODB_URI = '';

    const inputLead = {
      type: 'newsletter',
      email: 'newsletter@example.com',
    };

    const savedLead = await saveLeadAsync(inputLead);

    assert.ok(savedLead.id.startsWith('fallback_'));
    assert.equal(savedLead.type, 'newsletter');
    assert.equal(savedLead.email, 'newsletter@example.com');
    assert.equal(savedLead.status, 'new');
  });
});
