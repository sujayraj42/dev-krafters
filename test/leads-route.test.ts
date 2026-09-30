import assert from 'node:assert';
import { test } from 'node:test';
import { DELETE } from '../src/app/api/leads/route';
import { generateTotpCode, DEFAULT_ADMIN_TOTP_SECRET } from '../src/lib/totp';

test('DELETE /api/leads - returns 401 Unauthorized when request is unauthenticated', async () => {
  const req = new Request('http://localhost:3000/api/leads', {
    method: 'DELETE',
  });

  const response = await DELETE(req);
  assert.strictEqual(response.status, 401);

  const json = await response.json();
  assert.strictEqual(json.success, false);
  assert.ok(json.error.includes('Unauthorized'));
});

test('DELETE /api/leads - rejects invalid token or backdoor passcode attempts', async () => {
  for (const invalidToken of ['admin', 'devkrafters', 'wrong_passcode', '123456']) {
    const req = new Request('http://localhost:3000/api/leads', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${invalidToken}`,
      },
    });

    const response = await DELETE(req);
    assert.strictEqual(response.status, 401, `Token '${invalidToken}' should be rejected with 401`);

    const json = await response.json();
    assert.strictEqual(json.success, false);
  }
});

test('DELETE /api/leads - succeeds with valid admin passcode in Authorization header', async () => {
  const adminPasscode = process.env.ADMIN_PASSCODE || '1234';
  const req = new Request('http://localhost:3000/api/leads', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminPasscode}`,
    },
  });

  const response = await DELETE(req);
  assert.strictEqual(response.status, 200);

  const json = await response.json();
  assert.strictEqual(json.success, true);
  assert.strictEqual(json.message, 'Leads database cleared successfully');
});

test('DELETE /api/leads - succeeds with valid Google Authenticator TOTP token', async () => {
  const secret = process.env.ADMIN_TOTP_SECRET || DEFAULT_ADMIN_TOTP_SECRET;
  const totpCode = await generateTotpCode(secret);

  const req = new Request('http://localhost:3000/api/leads', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${totpCode}`,
    },
  });

  const response = await DELETE(req);
  assert.strictEqual(response.status, 200);

  const json = await response.json();
  assert.strictEqual(json.success, true);
});
