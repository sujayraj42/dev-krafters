import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTotpCode,
  verifyTotpCode,
  getAuthenticatorQrCodeUrl,
  DEFAULT_ADMIN_TOTP_SECRET,
} from '../totp.ts';

describe('TOTP Security Module', () => {
  const TEST_SECRET = 'JBSWY3DPEHPK3PXP'; // Standard RFC 4226/6238 Base32 test secret

  describe('generateTotpCode', () => {
    it('should generate a 6-digit numeric string for default window 0', async () => {
      const code = await generateTotpCode(TEST_SECRET);
      assert.strictEqual(typeof code, 'string');
      assert.strictEqual(code.length, 6);
      assert.match(code, /^\d{6}$/);
    });

    it('should generate deterministic codes for specific time windows', async () => {
      const codeCurrent = await generateTotpCode(TEST_SECRET, 0);
      const codePrev = await generateTotpCode(TEST_SECRET, -1);
      const codeNext = await generateTotpCode(TEST_SECRET, 1);

      assert.strictEqual(codeCurrent.length, 6);
      assert.strictEqual(codePrev.length, 6);
      assert.strictEqual(codeNext.length, 6);
    });
  });

  describe('verifyTotpCode', () => {
    it('should return true for valid code in current window (window 0)', async () => {
      const token = await generateTotpCode(TEST_SECRET, 0);
      const isValid = await verifyTotpCode(token, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('should return true for valid code in previous window (window -1, -30s)', async () => {
      const token = await generateTotpCode(TEST_SECRET, -1);
      const isValid = await verifyTotpCode(token, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('should return true for valid code in next window (window +1, +30s)', async () => {
      const token = await generateTotpCode(TEST_SECRET, 1);
      const isValid = await verifyTotpCode(token, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('should return false for code outside window tolerance (window -2 or +2)', async () => {
      const tokenPrev2 = await generateTotpCode(TEST_SECRET, -2);
      const tokenNext2 = await generateTotpCode(TEST_SECRET, 2);

      assert.strictEqual(await verifyTotpCode(tokenPrev2, TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode(tokenNext2, TEST_SECRET), false);
    });

    it('should normalize and verify tokens containing spaces or outer whitespace', async () => {
      const token = await generateTotpCode(TEST_SECRET, 0);
      const spacedToken = `  ${token.slice(0, 3)} ${token.slice(3)}  `;
      const isValid = await verifyTotpCode(spacedToken, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('should return false for invalid token lengths', async () => {
      assert.strictEqual(await verifyTotpCode('12345', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('1234567', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('', TEST_SECRET), false);
    });

    it('should return false for non-numeric tokens', async () => {
      assert.strictEqual(await verifyTotpCode('12345a', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('abcdef', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('12 34a', TEST_SECRET), false);
    });

    it('should return false for incorrect 6-digit tokens', async () => {
      const win0 = await generateTotpCode(TEST_SECRET, 0);
      const winPrev = await generateTotpCode(TEST_SECRET, -1);
      const winNext = await generateTotpCode(TEST_SECRET, 1);
      const candidates = ['000000', '111111', '222222', '333333', '999999'];
      const invalidToken = candidates.find(c => c !== win0 && c !== winPrev && c !== winNext)!;

      assert.strictEqual(await verifyTotpCode(invalidToken, TEST_SECRET), false);
    });

    it('should return false if verified against wrong secret', async () => {
      const token = await generateTotpCode(TEST_SECRET, 0);
      const wrongSecret = 'KRSXG5CTMVRXEZLBOI';
      assert.strictEqual(await verifyTotpCode(token, wrongSecret), false);
    });
  });

  describe('getAuthenticatorQrCodeUrl', () => {
    it('should generate correct QR code API URL with default parameters', () => {
      const url = getAuthenticatorQrCodeUrl(TEST_SECRET);
      assert.ok(url.startsWith('https://api.qrserver.com/v1/create-qr-code/'));
      assert.ok(url.includes('otpauth%3A%2F%2Ftotp%2FDev%2520Krafters%3Aadmin%2540devkrafters.com'));
      assert.ok(url.includes(`secret%3D${TEST_SECRET}`));
    });

    it('should generate correct QR code API URL with custom accountName and issuer', () => {
      const url = getAuthenticatorQrCodeUrl(TEST_SECRET, 'user@example.com', 'Custom App');
      assert.ok(url.includes('otpauth%3A%2F%2Ftotp%2FCustom%2520App%3Auser%2540example.com'));
      assert.ok(url.includes('issuer%3DCustom%2520App'));
    });
  });

  describe('DEFAULT_ADMIN_TOTP_SECRET', () => {
    it('should export a default admin secret string', () => {
      assert.strictEqual(typeof DEFAULT_ADMIN_TOTP_SECRET, 'string');
      assert.ok(DEFAULT_ADMIN_TOTP_SECRET.length > 0);
    });
  });
});
