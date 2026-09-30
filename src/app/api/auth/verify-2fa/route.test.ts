import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from './route';

test('GET /api/auth/verify-2fa should not expose default passcodes or ADMIN_PASSCODE', async () => {
  const response = await GET();
  const data = await response.json();

  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.passcodeDefault, undefined);
  assert.strictEqual('passcode' in data, false);
});

test('POST /api/auth/verify-2fa should reject hardcoded PINs when ADMIN_PASSCODE is not set', async () => {
  const originalPasscode = process.env.ADMIN_PASSCODE;
  delete process.env.ADMIN_PASSCODE;

  try {
    const hardcodedPins = ['1234', 'admin', 'devkrafters', '0000'];
    for (const pin of hardcodedPins) {
      const request = new Request('http://localhost/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const response = await POST(request);
      const data = await response.json();

      assert.strictEqual(response.status, 401, `PIN ${pin} should be rejected when ADMIN_PASSCODE is not set`);
      assert.strictEqual(data.success, false);
    }
  } finally {
    if (originalPasscode !== undefined) {
      process.env.ADMIN_PASSCODE = originalPasscode;
    } else {
      delete process.env.ADMIN_PASSCODE;
    }
  }
});

test('POST /api/auth/verify-2fa should reject incorrect PINs even when ADMIN_PASSCODE is set', async () => {
  const originalPasscode = process.env.ADMIN_PASSCODE;
  process.env.ADMIN_PASSCODE = 'super-secret-passcode-9876';

  try {
    const invalidPins = ['1234', 'admin', 'devkrafters', 'wrongpasscode'];
    for (const pin of invalidPins) {
      const request = new Request('http://localhost/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const response = await POST(request);
      const data = await response.json();

      assert.strictEqual(response.status, 401, `PIN ${pin} should be rejected when it does not match ADMIN_PASSCODE`);
      assert.strictEqual(data.success, false);
    }
  } finally {
    if (originalPasscode !== undefined) {
      process.env.ADMIN_PASSCODE = originalPasscode;
    } else {
      delete process.env.ADMIN_PASSCODE;
    }
  }
});

test('POST /api/auth/verify-2fa should accept correct PIN when ADMIN_PASSCODE is configured', async () => {
  const originalPasscode = process.env.ADMIN_PASSCODE;
  const validPasscode = 'my-custom-admin-passcode-54321';
  process.env.ADMIN_PASSCODE = validPasscode;

  try {
    const request = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: validPasscode }),
    });

    const response = await POST(request);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.method, 'passcode');
  } finally {
    if (originalPasscode !== undefined) {
      process.env.ADMIN_PASSCODE = originalPasscode;
    } else {
      delete process.env.ADMIN_PASSCODE;
    }
  }
});
