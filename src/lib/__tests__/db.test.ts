import { saveLeadAsync } from '../db';

// Mocks for MongoDB client
const mockInsertOne = jest.fn();
const mockCollection = jest.fn().mockImplementation(() => ({
  insertOne: mockInsertOne,
}));
const mockDb = {
  collection: mockCollection,
};
const mockClient = {
  db: jest.fn().mockReturnValue(mockDb),
};

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: Promise.resolve(mockClient),
}));

describe('db - saveLeadAsync', () => {
  const originalEnv = process.env;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, MONGODB_URI: 'mongodb://localhost:27017/test_db' };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    consoleErrorSpy.mockRestore();
  });

  describe('Happy path', () => {
    it('should successfully save lead and return LeadRecord with insertedId', async () => {
      const mockInsertedId = { toString: () => '507f1f77bcf86cd799439011' };
      mockInsertOne.mockResolvedValueOnce({ insertedId: mockInsertedId });

      const leadData = {
        name: 'Alice Smith',
        email: 'alice@example.com',
        type: 'contact',
        message: 'Interested in services',
      };

      const result = await saveLeadAsync(leadData);

      expect(mockCollection).toHaveBeenCalledWith('leads');
      expect(mockInsertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice Smith',
          email: 'alice@example.com',
          type: 'contact',
          message: 'Interested in services',
          status: 'new',
          date: expect.any(String),
          createdAt: expect.any(Date),
        })
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: '507f1f77bcf86cd799439011',
          name: 'Alice Smith',
          email: 'alice@example.com',
          type: 'contact',
          status: 'new',
        })
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should preserve provided status and date', async () => {
      const mockInsertedId = { toString: () => '607f1f77bcf86cd799439022' };
      mockInsertOne.mockResolvedValueOnce({ insertedId: mockInsertedId });

      const leadData = {
        name: 'Bob Jones',
        email: 'bob@example.com',
        type: 'estimate',
        status: 'in_progress',
        date: '2025-01-01T00:00:00.000Z',
      };

      const result = await saveLeadAsync(leadData);

      expect(result).toEqual(
        expect.objectContaining({
          id: '607f1f77bcf86cd799439022',
          status: 'in_progress',
          date: '2025-01-01T00:00:00.000Z',
        })
      );
    });
  });

  describe('Error paths', () => {
    it('should handle Error instances thrown during insertOne and return fallback lead', async () => {
      const dbError = new Error('Database write connection failed');
      mockInsertOne.mockRejectedValueOnce(dbError);

      const leadData = {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        type: 'newsletter',
      };

      const result = await saveLeadAsync(leadData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[MongoDB Save Error]',
        'Database write connection failed'
      );
      expect(result.id).toMatch(/^fallback_\d+$/);
      expect(result).toEqual(
        expect.objectContaining({
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          type: 'newsletter',
          status: 'new',
          date: expect.any(String),
        })
      );
    });

    it('should handle non-Error objects thrown during insertOne and return fallback lead', async () => {
      const rawStringError = 'Fatal MongoDB connection string error';
      mockInsertOne.mockRejectedValueOnce(rawStringError);

      const leadData = {
        name: 'David Miller',
        email: 'david@example.com',
      };

      const result = await saveLeadAsync(leadData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[MongoDB Save Error]',
        'Fatal MongoDB connection string error'
      );
      expect(result.id).toMatch(/^fallback_\d+$/);
      expect(result.type).toBe('contact');
      expect(result.status).toBe('new');
    });

    it('should handle missing MONGODB_URI error and return fallback lead', async () => {
      delete process.env.MONGODB_URI;

      const leadData = {
        name: 'Eve Online',
        email: 'eve@example.com',
        type: 'chatbot',
      };

      const result = await saveLeadAsync(leadData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[MongoDB Save Error]',
        'MONGODB_URI contains placeholder <db_password>. Please set your actual MongoDB Atlas password in Vercel Environment Variables.'
      );
      expect(result.id).toMatch(/^fallback_\d+$/);
      expect(result.name).toBe('Eve Online');
      expect(result.type).toBe('chatbot');
    });

    it('should handle MONGODB_URI with placeholder password error and return fallback lead', async () => {
      process.env.MONGODB_URI = 'mongodb+srv://user:<db_password>@cluster.mongodb.net/test';

      const leadData = {
        name: 'Frank Ocean',
        email: 'frank@example.com',
        type: 'contact',
      };

      const result = await saveLeadAsync(leadData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[MongoDB Save Error]',
        'MONGODB_URI contains placeholder <db_password>. Please set your actual MongoDB Atlas password in Vercel Environment Variables.'
      );
      expect(result.id).toMatch(/^fallback_\d+$/);
      expect(result.name).toBe('Frank Ocean');
    });
  });
});
