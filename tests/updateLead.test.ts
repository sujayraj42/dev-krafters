import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ObjectId } from 'mongodb';

// Set environment variable prior to module load so client creation is attempted
process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';

let lastQuery: any = null;
let lastUpdate: any = null;
let mockModifiedCount = 1;
let shouldThrowError = false;

const mockLeadsCollection = {
  updateOne: async (query: any, update: any) => {
    if (shouldThrowError) {
      throw new Error('Database operation failed');
    }
    lastQuery = query;
    lastUpdate = update;
    return {
      acknowledged: true,
      matchedCount: mockModifiedCount,
      modifiedCount: mockModifiedCount,
      upsertedCount: 0,
      upsertedId: null,
    };
  },
};

const mockDb = {
  collection: (name: string) => {
    if (name === 'leads') {
      return mockLeadsCollection;
    }
    throw new Error(`Unexpected collection: ${name}`);
  },
};

const mockClient = {
  db: (_dbName?: string) => mockDb,
};

// Intercept global mongo client promise to return mock DB
(global as any)._mongoClientPromise = Promise.resolve(mockClient);

import { updateLeadAsync } from '../src/lib/db';

describe('updateLeadAsync', () => {
  const originalEnvUri = process.env.MONGODB_URI;

  beforeEach(() => {
    lastQuery = null;
    lastUpdate = null;
    mockModifiedCount = 1;
    shouldThrowError = false;
    process.env.MONGODB_URI = originalEnvUri || 'mongodb://localhost:27017/test_db';
  });

  it('successfully updates lead with valid ObjectId and returns true', async () => {
    const validObjectId = new ObjectId().toString();
    const result = await updateLeadAsync(validObjectId, {
      status: 'in_progress',
      notes: 'Followed up with client via email',
    });

    assert.strictEqual(result, true);
    assert.ok(lastQuery._id instanceof ObjectId);
    assert.strictEqual(lastQuery._id.toString(), validObjectId);
    assert.strictEqual(lastUpdate.$set.status, 'in_progress');
    assert.strictEqual(lastUpdate.$set.notes, 'Followed up with client via email');
    assert.ok(lastUpdate.$set.updatedAt instanceof Date);
  });

  it('returns false when lead is missing or no document was modified', async () => {
    mockModifiedCount = 0;
    const validObjectId = new ObjectId().toString();
    const result = await updateLeadAsync(validObjectId, {
      status: 'converted',
    });

    assert.strictEqual(result, false);
    assert.ok(lastQuery._id instanceof ObjectId);
    assert.strictEqual(lastUpdate.$set.status, 'converted');
  });

  it('handles non-ObjectId custom string IDs correctly', async () => {
    const customId = 'lead_custom_12345';
    const result = await updateLeadAsync(customId, {
      notes: 'Custom ID note update',
    });

    assert.strictEqual(result, true);
    assert.strictEqual(typeof lastQuery._id, 'string');
    assert.strictEqual(lastQuery._id, customId);
    assert.strictEqual(lastUpdate.$set.notes, 'Custom ID note update');
  });

  it('supports partial updates (status only or notes only)', async () => {
    const id = new ObjectId().toString();

    // Partial update 1: Status only
    const statusResult = await updateLeadAsync(id, { status: 'converted' });
    assert.strictEqual(statusResult, true);
    assert.strictEqual(lastUpdate.$set.status, 'converted');
    assert.strictEqual(lastUpdate.$set.notes, undefined);

    // Partial update 2: Notes only
    const notesResult = await updateLeadAsync(id, { notes: 'Only notes updated' });
    assert.strictEqual(notesResult, true);
    assert.strictEqual(lastUpdate.$set.status, undefined);
    assert.strictEqual(lastUpdate.$set.notes, 'Only notes updated');
  });

  it('returns false and catches error when MongoDB collection update throws', async () => {
    shouldThrowError = true;
    const validObjectId = new ObjectId().toString();

    const result = await updateLeadAsync(validObjectId, { status: 'in_progress' });

    assert.strictEqual(result, false);
  });

  it('returns false when database connection/environment error occurs', async () => {
    process.env.MONGODB_URI = 'mongodb://user:<db_password>@cluster.mongodb.net/test';

    const validObjectId = new ObjectId().toString();
    const result = await updateLeadAsync(validObjectId, { status: 'in_progress' });

    assert.strictEqual(result, false);
  });
});
