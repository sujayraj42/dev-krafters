import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from './route';
import { generateTotpCode, DEFAULT_ADMIN_TOTP_SECRET } from '@/lib/totp';

describe('GET /api/auth/verify-2fa', () => {
  it('returns QR code URL, secret, and passcode default', async () => {
    const response = await GET();
    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.success, true);
    assert.ok(data.secret);
    assert.ok(data.qrCodeUrl);
    assert.ok(data.passcodeDefault);
  });
});

describe('POST /api/auth/verify-2fa', () => {
  it('succeeds with a valid fallback passcode PIN', async () => {
    const req = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1234' }),
    });

    const response = await POST(req);
    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.success, true);
    assert.equal(data.method, 'passcode');
    assert.equal(data.message, 'Unlocked via Passcode PIN');
  });

  it('succeeds with a valid 6-digit Google Authenticator TOTP token', async () => {
    const validCode = await generateTotpCode(DEFAULT_ADMIN_TOTP_SECRET);
    const req = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: validCode }),
    });

    const response = await POST(req);
    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.success, true);
    assert.equal(data.method, 'google_authenticator');
    assert.equal(data.message, 'Unlocked via Google Authenticator 2FA');
  });

  it('returns 401 status when providing invalid passcode PIN or TOTP code', async () => {
    const req = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: 'wrongpin', code: '000000' }),
    });

    const response = await POST(req);
    assert.equal(response.status, 401);

    const data = await response.json();
    assert.equal(data.success, false);
    assert.equal(data.error, 'Invalid 6-digit Google Authenticator code or passcode PIN.');
  });

  it('returns 500 status when request body contains invalid JSON (error path test)', async () => {
    const req = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json payload }',
    });

    const response = await POST(req);
    assert.equal(response.status, 500);

    const data = await response.json();
    assert.equal(data.success, false);
    assert.ok(typeof data.error === 'string' && data.error.length > 0);
  });
});
