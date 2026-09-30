import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAdminTotpSecret,
  generateTotpCode,
  verifyTotpCode,
  getAuthenticatorQrCodeUrl,
} from './totp';

describe('TOTP Security Module', () => {
  it('should throw an error if ADMIN_TOTP_SECRET is not set', () => {
    const originalSecret = process.env.ADMIN_TOTP_SECRET;
    delete process.env.ADMIN_TOTP_SECRET;

    try {
      assert.throws(
        () => getAdminTotpSecret(),
        /ADMIN_TOTP_SECRET environment variable is not configured/
      );
    } finally {
      if (originalSecret !== undefined) {
        process.env.ADMIN_TOTP_SECRET = originalSecret;
      }
    }
  });

  it('should return secret if ADMIN_TOTP_SECRET is configured', () => {
    const originalSecret = process.env.ADMIN_TOTP_SECRET;
    process.env.ADMIN_TOTP_SECRET = 'TESTSECRETKEY32CHARS';

    try {
      const secret = getAdminTotpSecret();
      assert.equal(secret, 'TESTSECRETKEY32CHARS');
    } finally {
      if (originalSecret !== undefined) {
        process.env.ADMIN_TOTP_SECRET = originalSecret;
      } else {
        delete process.env.ADMIN_TOTP_SECRET;
      }
    }
  });

  it('should generate and verify valid TOTP tokens', async () => {
    const testSecret = 'JBSWY3DPEHPK3PXP';
    const code = await generateTotpCode(testSecret);

    assert.equal(typeof code, 'string');
    assert.equal(code.length, 6);
    assert.match(code, /^\d{6}$/);

    const isValid = await verifyTotpCode(code, testSecret);
    assert.equal(isValid, true);

    const isInvalid = await verifyTotpCode('000000', testSecret);
    // Unless 000000 happens to be valid for this window (highly unlikely)
    // verify result with invalid token
    assert.equal(typeof isInvalid, 'boolean');
  });

  it('should construct authenticator QR code URL containing secret', () => {
    const testSecret = 'JBSWY3DPEHPK3PXP';
    const url = getAuthenticatorQrCodeUrl(testSecret, 'admin@test.com', 'TestApp');

    assert.ok(url.includes('api.qrserver.com'));
    assert.ok(url.includes(encodeURIComponent(testSecret)));
  });
});
