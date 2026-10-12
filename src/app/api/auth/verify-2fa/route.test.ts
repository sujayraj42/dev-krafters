import assert from 'node:assert';
import { test } from 'node:test';
import { GET } from './route';

test('GET /api/auth/verify-2fa - Unauthorized without authorization header', async () => {
  const req = new Request('http://localhost/api/auth/verify-2fa', {
    method: 'GET',
  });

  const res = await GET(req);
  assert.strictEqual(res.status, 401);

  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.match(data.error, /Unauthorized/);
});

test('GET /api/auth/verify-2fa - Unauthorized with invalid token', async () => {
  const req = new Request('http://localhost/api/auth/verify-2fa', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer invalid-token-123',
    },
  });

  const res = await GET(req);
  assert.strictEqual(res.status, 401);

  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.match(data.error, /Unauthorized/);
});

test('GET /api/auth/verify-2fa - Success with valid admin passcode', async () => {
  const adminPasscode = process.env.ADMIN_PASSCODE || '1234';
  const req = new Request('http://localhost/api/auth/verify-2fa', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${adminPasscode}`,
    },
  });

  const res = await GET(req);
  assert.strictEqual(res.status, 200);

  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(typeof data.secret, 'string');
  assert.strictEqual(typeof data.qrCodeUrl, 'string');
  assert.strictEqual(typeof data.passcodeDefault, 'string');
});
