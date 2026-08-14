import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyTotpCode,
  generateTotpCode,
  getAuthenticatorQrCodeUrl,
  DEFAULT_ADMIN_TOTP_SECRET,
} from './totp.ts';

const TEST_SECRET = 'JBSWY3DPEHPK3PXP'; // Standard Base32 test secret ("Hello!")

describe('totp security module', () => {
  describe('verifyTotpCode', () => {
    it('returns true for a valid code in current time window (0)', async () => {
      const validCode = await generateTotpCode(TEST_SECRET, 0);
      const isValid = await verifyTotpCode(validCode, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('returns true for a valid code in previous window (-1)', async () => {
      const prevCode = await generateTotpCode(TEST_SECRET, -1);
      const isValid = await verifyTotpCode(prevCode, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('returns true for a valid code in next window (+1)', async () => {
      const nextCode = await generateTotpCode(TEST_SECRET, 1);
      const isValid = await verifyTotpCode(nextCode, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('cleans whitespace and verifies valid code correctly', async () => {
      const validCode = await generateTotpCode(TEST_SECRET, 0);
      const codeWithSpaces = `  ${validCode.slice(0, 3)}  ${validCode.slice(3)}  `;
      const isValid = await verifyTotpCode(codeWithSpaces, TEST_SECRET);
      assert.strictEqual(isValid, true);
    });

    it('returns false for code outside clock drift window (-2)', async () => {
      const expiredCode = await generateTotpCode(TEST_SECRET, -2);
      // Ensure the expired code doesn't happen to match window 0, -1, or 1
      const currentCode = await generateTotpCode(TEST_SECRET, 0);
      const prevCode = await generateTotpCode(TEST_SECRET, -1);
      const nextCode = await generateTotpCode(TEST_SECRET, 1);

      if (
        expiredCode !== currentCode &&
        expiredCode !== prevCode &&
        expiredCode !== nextCode
      ) {
        const isValid = await verifyTotpCode(expiredCode, TEST_SECRET);
        assert.strictEqual(isValid, false);
      }
    });

    it('returns false for code outside clock drift window (+2)', async () => {
      const futureCode = await generateTotpCode(TEST_SECRET, 2);
      const currentCode = await generateTotpCode(TEST_SECRET, 0);
      const prevCode = await generateTotpCode(TEST_SECRET, -1);
      const nextCode = await generateTotpCode(TEST_SECRET, 1);

      if (
        futureCode !== currentCode &&
        futureCode !== prevCode &&
        futureCode !== nextCode
      ) {
        const isValid = await verifyTotpCode(futureCode, TEST_SECRET);
        assert.strictEqual(isValid, false);
      }
    });

    it('returns false for incorrect 6-digit code', async () => {
      const validCode = await generateTotpCode(TEST_SECRET, 0);
      // Generate a wrong code by modifying valid code
      const wrongCode = validCode === '123456' ? '654321' : '000000';
      const isValid = await verifyTotpCode(wrongCode, TEST_SECRET);
      assert.strictEqual(isValid, false);
    });

    it('returns false for token with invalid length', async () => {
      assert.strictEqual(await verifyTotpCode('', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('12345', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('1234567', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('   ', TEST_SECRET), false);
    });

    it('returns false for token with non-digit characters', async () => {
      assert.strictEqual(await verifyTotpCode('abcdef', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('12345a', TEST_SECRET), false);
      assert.strictEqual(await verifyTotpCode('12 34a', TEST_SECRET), false);
    });
  });

  describe('generateTotpCode', () => {
    it('generates a 6-digit numeric string', async () => {
      const code = await generateTotpCode(TEST_SECRET);
      assert.strictEqual(typeof code, 'string');
      assert.strictEqual(code.length, 6);
      assert.match(code, /^\d{6}$/);
    });
  });

  describe('getAuthenticatorQrCodeUrl', () => {
    it('generates QR code URL with default parameters', () => {
      const url = getAuthenticatorQrCodeUrl(TEST_SECRET);
      assert.ok(url.startsWith('https://api.qrserver.com/v1/create-qr-code/'));
      const parsed = new URL(url);
      const dataParam = parsed.searchParams.get('data');
      assert.ok(dataParam);
      const decodedTotpUri = decodeURIComponent(dataParam);
      assert.ok(decodedTotpUri.startsWith('otpauth://totp/'));
      assert.ok(decodedTotpUri.includes(TEST_SECRET));
      assert.ok(decodedTotpUri.includes('admin@devkrafters.com'));
      assert.ok(decodedTotpUri.includes('Dev Krafters'));
    });

    it('generates QR code URL with custom parameters', () => {
      const url = getAuthenticatorQrCodeUrl(TEST_SECRET, 'user@example.com', 'My App');
      const parsed = new URL(url);
      const dataParam = parsed.searchParams.get('data');
      assert.ok(dataParam);
      const decodedTotpUri = decodeURIComponent(dataParam);
      assert.ok(decodedTotpUri.includes(TEST_SECRET));
      assert.ok(decodedTotpUri.includes('user@example.com'));
      assert.ok(decodedTotpUri.includes('My App'));
    });
  });

  describe('DEFAULT_ADMIN_TOTP_SECRET', () => {
    it('is defined and non-empty', () => {
      assert.ok(DEFAULT_ADMIN_TOTP_SECRET);
      assert.strictEqual(typeof DEFAULT_ADMIN_TOTP_SECRET, 'string');
      assert.ok(DEFAULT_ADMIN_TOTP_SECRET.length > 0);
    });
  });
});
