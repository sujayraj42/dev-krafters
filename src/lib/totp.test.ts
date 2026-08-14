import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTotpCode, verifyTotpCode, getAuthenticatorQrCodeUrl } from './totp';
import { GET, POST } from '../app/api/auth/verify-2fa/route';

test('TOTP generation and verification with valid secret', async () => {
  const secret = 'JBSWY3DPEHPK3PXP';
  const code = await generateTotpCode(secret);

  assert.equal(typeof code, 'string');
  assert.equal(code.length, 6);
  assert.match(code, /^\d{6}$/);

  const isValid = await verifyTotpCode(code, secret);
  assert.equal(isValid, true);
});

test('TOTP verification fails for invalid code', async () => {
  const secret = 'JBSWY3DPEHPK3PXP';
  const isValid = await verifyTotpCode('000000', secret);
  // Unlikely to match unless valid code happens to be 000000
  // Test with invalid token string format
  const isInvalidFormat = await verifyTotpCode('1234', secret);
  assert.equal(isInvalidFormat, false);
});

test('getAuthenticatorQrCodeUrl includes secret and issuer', () => {
  const secret = 'MYCUSTOMSECRET123';
  const url = getAuthenticatorQrCodeUrl(secret, 'testuser', 'TestIssuer');
  const decodedUrl = decodeURIComponent(url);
  assert.ok(decodedUrl.includes(secret));
  assert.ok(decodedUrl.includes('testuser'));
  assert.ok(decodedUrl.includes('TestIssuer'));
});

test('totp module does not export DEFAULT_ADMIN_TOTP_SECRET', async () => {
  const totpModule = await import('./totp');
  assert.equal('DEFAULT_ADMIN_TOTP_SECRET' in totpModule, false);
});

test('GET /api/auth/verify-2fa returns 500 when ADMIN_TOTP_SECRET is missing', async () => {
  const originalEnv = process.env.ADMIN_TOTP_SECRET;
  delete process.env.ADMIN_TOTP_SECRET;

  try {
    const res = await GET();
    assert.equal(res.status, 500);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.match(json.error, /ADMIN_TOTP_SECRET environment variable is not configured/);
  } finally {
    if (originalEnv !== undefined) {
      process.env.ADMIN_TOTP_SECRET = originalEnv;
    }
  }
});

test('GET /api/auth/verify-2fa returns secret and qrCodeUrl when ADMIN_TOTP_SECRET is set', async () => {
  const originalEnv = process.env.ADMIN_TOTP_SECRET;
  process.env.ADMIN_TOTP_SECRET = 'TESTSECRET123456';

  try {
    const res = await GET();
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.secret, 'TESTSECRET123456');
    assert.ok(json.qrCodeUrl.includes('TESTSECRET123456'));
  } finally {
    if (originalEnv !== undefined) {
      process.env.ADMIN_TOTP_SECRET = originalEnv;
    } else {
      delete process.env.ADMIN_TOTP_SECRET;
    }
  }
});

test('POST /api/auth/verify-2fa returns 500 on TOTP attempt when ADMIN_TOTP_SECRET is missing', async () => {
  const originalEnv = process.env.ADMIN_TOTP_SECRET;
  delete process.env.ADMIN_TOTP_SECRET;

  try {
    const req = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '123456' }),
    });

    const res = await POST(req);
    assert.equal(res.status, 500);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.match(json.error, /ADMIN_TOTP_SECRET/);
  } finally {
    if (originalEnv !== undefined) {
      process.env.ADMIN_TOTP_SECRET = originalEnv;
    }
  }
});

test('POST /api/auth/verify-2fa verifies valid TOTP code when ADMIN_TOTP_SECRET is set', async () => {
  const originalEnv = process.env.ADMIN_TOTP_SECRET;
  const testSecret = 'TESTSECRET1234567890';
  process.env.ADMIN_TOTP_SECRET = testSecret;

  try {
    const code = await generateTotpCode(testSecret);
    const req = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const res = await POST(req);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.method, 'google_authenticator');
  } finally {
    if (originalEnv !== undefined) {
      process.env.ADMIN_TOTP_SECRET = originalEnv;
    } else {
      delete process.env.ADMIN_TOTP_SECRET;
    }
  }
});
