import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTotpCode,
  verifyTotpCode,
  getAuthenticatorQrCodeUrl,
  DEFAULT_ADMIN_TOTP_SECRET,
} from './totp';

describe('totp module', () => {
  let originalDateNow: () => number;

  beforeEach(() => {
    originalDateNow = Date.now;
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  describe('generateTotpCode', () => {
    it('generates a valid 6-digit numeric string', async () => {
      const code = await generateTotpCode('JBSWY3DPEHPK3PXP');
      assert.strictEqual(typeof code, 'string');
      assert.strictEqual(code.length, 6);
      assert.match(code, /^\d{6}$/);
    });

    it('returns consistent TOTP codes for fixed timestamps', async () => {
      const fixedTimeMs = 1700000000000;
      Date.now = () => fixedTimeMs;

      const secret = 'JBSWY3DPEHPK3PXP';
      const code1 = await generateTotpCode(secret);
      const code2 = await generateTotpCode(secret);

      assert.strictEqual(code1, code2);
      assert.match(code1, /^\d{6}$/);
    });

    it('generates different codes for different timeStepWindow offsets', async () => {
      const fixedTimeMs = 1700000000000;
      Date.now = () => fixedTimeMs;

      const secret = 'JBSWY3DPEHPK3PXP';
      const codeCurrent = await generateTotpCode(secret, 0);
      const codePrevious = await generateTotpCode(secret, -1);
      const codeNext = await generateTotpCode(secret, 1);

      assert.notStrictEqual(codeCurrent, codePrevious);
      assert.notStrictEqual(codeCurrent, codeNext);
      assert.notStrictEqual(codePrevious, codeNext);
    });

    it('generates different codes for different secrets', async () => {
      const fixedTimeMs = 1700000000000;
      Date.now = () => fixedTimeMs;

      const code1 = await generateTotpCode('JBSWY3DPEHPK3PXP');
      const code2 = await generateTotpCode('KRSXG5CTMVRXEZLBOI');

      assert.notStrictEqual(code1, code2);
    });

    it('pads codes with leading zeros when needed', async () => {
      for (let timeSec = 0; timeSec < 300; timeSec += 30) {
        Date.now = () => timeSec * 1000;
        const code = await generateTotpCode('JBSWY3DPEHPK3PXP');
        assert.strictEqual(code.length, 6);
        assert.match(code, /^\d{6}$/);
      }
    });
  });

  describe('verifyTotpCode', () => {
    it('returns true for exact current time window token', async () => {
      Date.now = () => 1700000000000;
      const secret = 'JBSWY3DPEHPK3PXP';
      const validCode = await generateTotpCode(secret, 0);

      const isValid = await verifyTotpCode(validCode, secret);
      assert.strictEqual(isValid, true);
    });

    it('returns true for previous (-1) time step window token (clock drift tolerance)', async () => {
      Date.now = () => 1700000000000;
      const secret = 'JBSWY3DPEHPK3PXP';
      const prevCode = await generateTotpCode(secret, -1);

      const isValid = await verifyTotpCode(prevCode, secret);
      assert.strictEqual(isValid, true);
    });

    it('returns true for next (+1) time step window token (clock drift tolerance)', async () => {
      Date.now = () => 1700000000000;
      const secret = 'JBSWY3DPEHPK3PXP';
      const nextCode = await generateTotpCode(secret, 1);

      const isValid = await verifyTotpCode(nextCode, secret);
      assert.strictEqual(isValid, true);
    });

    it('returns false for token outside allowed window (+/-1)', async () => {
      Date.now = () => 1700000000000;
      const secret = 'JBSWY3DPEHPK3PXP';
      const farPastCode = await generateTotpCode(secret, -2);
      const farFutureCode = await generateTotpCode(secret, 2);

      assert.strictEqual(await verifyTotpCode(farPastCode, secret), false);
      assert.strictEqual(await verifyTotpCode(farFutureCode, secret), false);
    });

    it('returns false for invalid token length or non-digit characters', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';

      assert.strictEqual(await verifyTotpCode('12345', secret), false);
      assert.strictEqual(await verifyTotpCode('1234567', secret), false);
      assert.strictEqual(await verifyTotpCode('abcdef', secret), false);
      assert.strictEqual(await verifyTotpCode('', secret), false);
    });

    it('trims whitespace around valid tokens', async () => {
      Date.now = () => 1700000000000;
      const secret = 'JBSWY3DPEHPK3PXP';
      const validCode = await generateTotpCode(secret, 0);

      const isValid = await verifyTotpCode(`  ${validCode}  `, secret);
      assert.strictEqual(isValid, true);
    });

    it('returns false for incorrect TOTP code', async () => {
      Date.now = () => 1700000000000;
      const secret = 'JBSWY3DPEHPK3PXP';
      const validCode = await generateTotpCode(secret, 0);
      const wrongCode = validCode === '123456' ? '654321' : '123456';

      assert.strictEqual(await verifyTotpCode(wrongCode, secret), false);
    });
  });

  describe('getAuthenticatorQrCodeUrl', () => {
    it('generates a valid QR code URL with default parameters', () => {
      const secret = 'DEVKRAFTERS2FASECRET32';
      const url = getAuthenticatorQrCodeUrl(secret);

      assert.ok(url.startsWith('https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='));
      const decodedData = decodeURIComponent(url.split('data=')[1]);
      assert.ok(decodedData.includes('otpauth://totp/Dev%20Krafters:admin%40devkrafters.com'));
      assert.ok(decodedData.includes(`secret=${secret}`));
      assert.ok(decodedData.includes('issuer=Dev%20Krafters'));
    });

    it('generates a valid QR code URL with custom parameters', () => {
      const secret = 'CUSTOMSECRET32';
      const accountName = 'user@example.com';
      const issuer = 'Custom App';
      const url = getAuthenticatorQrCodeUrl(secret, accountName, issuer);

      const decodedData = decodeURIComponent(url.split('data=')[1]);
      assert.ok(decodedData.includes('otpauth://totp/Custom%20App:user%40example.com'));
      assert.ok(decodedData.includes(`secret=${secret}`));
      assert.ok(decodedData.includes('issuer=Custom%20App'));
    });
  });

  describe('DEFAULT_ADMIN_TOTP_SECRET', () => {
    it('is defined and non-empty string', () => {
      assert.strictEqual(typeof DEFAULT_ADMIN_TOTP_SECRET, 'string');
      assert.ok(DEFAULT_ADMIN_TOTP_SECRET.length > 0);
    });
  });
});
