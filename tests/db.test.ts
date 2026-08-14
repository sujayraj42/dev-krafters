import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { ObjectId } from 'mongodb';
import { getAllLeadsAsync } from '../src/lib/db';

describe('getAllLeadsAsync', () => {
  const originalEnv = process.env.MONGODB_URI;
  const originalMongoPromise = (global as any)._mongoClientPromise;

  let currentDbMock: ((dbName: string) => any) | null = null;

  beforeEach(() => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
    (global as any)._mongoClientPromise = Promise.resolve({
      db: (dbName: string) => {
        if (!currentDbMock) {
          throw new Error('No db mock provided');
        }
        return currentDbMock(dbName);
      },
    });
  });

  afterEach(() => {
    process.env.MONGODB_URI = originalEnv;
    (global as any)._mongoClientPromise = originalMongoPromise;
    currentDbMock = null;
  });

  test('returns formatted lead records when database has documents', async () => {
    const mockDocs = [
      {
        _id: new ObjectId('65d1234567890123456789a1'),
        type: 'estimate',
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '123-456-7890',
        projectType: 'Web Development',
        pages: 5,
        budget: '$5000',
        totalEstimateFormatted: '$5,000',
        totalEstimateInr: 400000,
        message: 'Need a fast website',
        fileUrl: 'https://example.com/spec.pdf',
        status: 'converted',
        notes: 'Followed up via phone',
        date: '2025-01-15T10:00:00.000Z',
      },
      {
        _id: new ObjectId('65d1234567890123456789a2'),
        type: 'newsletter',
        email: 'bob@example.com',
        date: '2025-01-10T12:00:00.000Z',
      },
    ];

    let findCalled = false;
    let sortQuery: any = null;

    currentDbMock = (dbName: string) => ({
      collection: (colName: string) => {
        assert.equal(colName, 'leads');
        return {
          find: (query: any) => {
            findCalled = true;
            assert.deepEqual(query, {});
            return {
              sort: (sortObj: any) => {
                sortQuery = sortObj;
                return {
                  toArray: async () => mockDocs,
                };
              },
            };
          },
        };
      },
    });

    const leads = await getAllLeadsAsync();

    assert.equal(findCalled, true);
    assert.deepEqual(sortQuery, { date: -1 });
    assert.equal(leads.length, 2);

    // Verify first lead mapping
    assert.deepEqual(leads[0], {
      id: '65d1234567890123456789a1',
      type: 'estimate',
      name: 'Alice Smith',
      email: 'alice@example.com',
      phone: '123-456-7890',
      projectType: 'Web Development',
      pages: 5,
      budget: '$5000',
      totalEstimateFormatted: '$5,000',
      totalEstimateInr: 400000,
      message: 'Need a fast website',
      fileUrl: 'https://example.com/spec.pdf',
      status: 'converted',
      notes: 'Followed up via phone',
      date: '2025-01-15T10:00:00.000Z',
    });

    // Verify second lead fallback values
    assert.equal(leads[1].id, '65d1234567890123456789a2');
    assert.equal(leads[1].type, 'newsletter');
    assert.equal(leads[1].email, 'bob@example.com');
    assert.equal(leads[1].status, 'new');
    assert.equal(leads[1].name, undefined);
  });

  test('applies default fallback values when properties are missing or date is a Date object', async () => {
    const mockDate = new Date('2025-02-01T08:30:00.000Z');
    const mockDocs = [
      {
        _id: new ObjectId('65d1234567890123456789a3'),
        date: mockDate,
      },
    ];

    currentDbMock = () => ({
      collection: () => ({
        find: () => ({
          sort: () => ({
            toArray: async () => mockDocs,
          }),
        }),
      }),
    });

    const leads = await getAllLeadsAsync();

    assert.equal(leads.length, 1);
    assert.equal(leads[0].id, '65d1234567890123456789a3');
    assert.equal(leads[0].type, 'contact');
    assert.equal(leads[0].status, 'new');
    assert.equal(leads[0].date, '2025-02-01T08:30:00.000Z');
  });

  test('returns empty array when collection is empty', async () => {
    currentDbMock = () => ({
      collection: () => ({
        find: () => ({
          sort: () => ({
            toArray: async () => [],
          }),
        }),
      }),
    });

    const leads = await getAllLeadsAsync();
    assert.deepEqual(leads, []);
  });

  test('returns empty array and handles error when query fails', async () => {
    currentDbMock = () => ({
      collection: () => ({
        find: () => ({
          sort: () => ({
            toArray: async () => {
              throw new Error('Database query failed');
            },
          }),
        }),
      }),
    });

    const leads = await getAllLeadsAsync();
    assert.deepEqual(leads, []);
  });

  test('returns empty array when MONGODB_URI is not set', async () => {
    delete process.env.MONGODB_URI;

    const leads = await getAllLeadsAsync();
    assert.deepEqual(leads, []);
  });

  test('returns empty array when MONGODB_URI contains placeholder password', async () => {
    process.env.MONGODB_URI = 'mongodb+srv://user:<db_password>@cluster.mongodb.net/test';

    const leads = await getAllLeadsAsync();
    assert.deepEqual(leads, []);
  });
});
