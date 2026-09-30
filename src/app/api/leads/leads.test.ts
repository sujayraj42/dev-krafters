import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, PATCH, DELETE, POST } from './route';

test('GET /api/leads - returns 401 Unauthorized when unauthenticated', async () => {
  const req = new Request('http://localhost/api/leads', { method: 'GET' });
  const res = await GET(req);
  assert.equal(res.status, 401);
  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error, 'Unauthorized: Admin authentication required');
});

test('PATCH /api/leads - returns 401 Unauthorized when unauthenticated', async () => {
  const req = new Request('http://localhost/api/leads', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'test_id', status: 'converted' }),
  });
  const res = await PATCH(req);
  assert.equal(res.status, 401);
  const json = await res.json();
  assert.equal(json.success, false);
});

test('DELETE /api/leads - returns 401 Unauthorized when unauthenticated', async () => {
  const req = new Request('http://localhost/api/leads', { method: 'DELETE' });
  const res = await DELETE(req);
  assert.equal(res.status, 401);
  const json = await res.json();
  assert.equal(json.success, false);
});

test('GET /api/leads - allows access with valid x-admin-passcode header', async () => {
  process.env.ADMIN_PASSCODE = 'test-passcode-123';
  const req = new Request('http://localhost/api/leads', {
    method: 'GET',
    headers: { 'x-admin-passcode': 'test-passcode-123' },
  });
  const res = await GET(req);
  // Status will be 503 (missing MONGODB_URI) or 200 (connected DB), but NOT 401 Unauthorized
  assert.notEqual(res.status, 401);
});

test('POST /api/leads - public submission allowed without auth header', async () => {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
  const req = new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Lead', email: 'test@example.com' }),
  });
  const res = await POST(req);
  assert.notEqual(res.status, 401);
});
