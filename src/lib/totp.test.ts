import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTotpCode,
  verifyTotpCode,
  getAuthenticatorQrCodeUrl,
  DEFAULT_ADMIN_TOTP_SECRET,
} from './totp.ts';

describe('totp security module', () => {
  const testSecret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'; // Base32 for "12345678901234567890"

  describe('generateTotpCode', () => {
    it('should generate a 6-digit string code', async () => {
      const code = await generateTotpCode(testSecret);
      assert.strictEqual(typeof code, 'string');
      assert.strictEqual(code.length, 6);
      assert.match(code, /^\d{6}$/);
    });

    it('should produce identical codes for secrets with lowercase or spaces/hyphens', async () => {
      const originalCode = await generateTotpCode(testSecret);
      const dirtySecret = ' gez-dgnb vgy3 tqoj qgez dgnb vgy3 tqojq ';
      const dirtyCode = await generateTotpCode(dirtySecret);

      assert.strictEqual(dirtyCode, originalCode);
    });

    it('should produce standard RFC 6238 TOTP value at fixed timestamp', async () => {
      // RFC 6238 test vector:
      // Secret ASCII: "12345678901234567890" -> Base32: "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
      // Time 59s -> timeStep = 1 -> RFC 6238 SHA1 code = "287082"
      const originalDateNow = Date.now;
      try {
        Date.now = () => 59000; // 59 seconds in ms
        const code = await generateTotpCode(testSecret);
        assert.strictEqual(code, '287082');
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('should match timeStepWindow shifts', async () => {
      const originalDateNow = Date.now;
      try {
        Date.now = () => 1000000000000;
        const currentCode = await generateTotpCode(testSecret, 0);
        const prevCodeShifted = await generateTotpCode(testSecret, -1);
        const nextCodeShifted = await generateTotpCode(testSecret, 1);

        // At T - 30 seconds, current window (0) should match prevCodeShifted at T
        Date.now = () => 1000000000000 - 30000;
        const codeAtTMinus30 = await generateTotpCode(testSecret, 0);
        assert.strictEqual(codeAtTMinus30, prevCodeShifted);

        // At T + 30 seconds, current window (0) should match nextCodeShifted at T
        Date.now = () => 1000000000000 + 30000;
        const codeAtTPlus30 = await generateTotpCode(testSecret, 0);
        assert.strictEqual(codeAtTPlus30, nextCodeShifted);
      } finally {
        Date.now = originalDateNow;
      }
    });
  });

  describe('verifyTotpCode', () => {
    it('should return true for current window token', async () => {
      const code = await generateTotpCode(testSecret);
      const isValid = await verifyTotpCode(code, testSecret);
      assert.strictEqual(isValid, true);
    });

    it('should return true for previous window (-30s) token', async () => {
      const prevCode = await generateTotpCode(testSecret, -1);
      const isValid = await verifyTotpCode(prevCode, testSecret);
      assert.strictEqual(isValid, true);
    });

    it('should return true for next window (+30s) token', async () => {
      const nextCode = await generateTotpCode(testSecret, 1);
      const isValid = await verifyTotpCode(nextCode, testSecret);
      assert.strictEqual(isValid, true);
    });

    it('should clean spaces in token input during verification', async () => {
      const code = await generateTotpCode(testSecret);
      const formattedCode = ` ${code.slice(0, 3)} ${code.slice(3)} `;
      const isValid = await verifyTotpCode(formattedCode, testSecret);
      assert.strictEqual(isValid, true);
    });

    it('should return false for out-of-tolerance window (-60s or +60s)', async () => {
      const farPastCode = await generateTotpCode(testSecret, -2);
      const farFutureCode = await generateTotpCode(testSecret, 2);

      assert.strictEqual(await verifyTotpCode(farPastCode, testSecret), false);
      assert.strictEqual(await verifyTotpCode(farFutureCode, testSecret), false);
    });

    it('should return false for incorrect TOTP code', async () => {
      const isValid = await verifyTotpCode('000000', testSecret);
      // Unless 000000 accidentally matches, but let's generate current code and invert last digit
      const currentCode = await generateTotpCode(testSecret);
      const wrongCode = (parseInt(currentCode, 10) + 1).toString().padStart(6, '0').slice(-6);
      if (wrongCode !== currentCode) {
        assert.strictEqual(await verifyTotpCode(wrongCode, testSecret), false);
      }
    });

    it('should return false for invalid token formats', async () => {
      assert.strictEqual(await verifyTotpCode('12345', testSecret), false); // too short
      assert.strictEqual(await verifyTotpCode('1234567', testSecret), false); // too long
      assert.strictEqual(await verifyTotpCode('abcdef', testSecret), false); // non-numeric
      assert.strictEqual(await verifyTotpCode('12345a', testSecret), false); // alphanumeric
      assert.strictEqual(await verifyTotpCode('', testSecret), false); // empty
    });
  });

  describe('getAuthenticatorQrCodeUrl', () => {
    it('should generate URL with default account and issuer', () => {
      const url = getAuthenticatorQrCodeUrl(testSecret);
      assert.ok(url.startsWith('https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='));

      const decodedDataParam = decodeURIComponent(url.replace('https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=', ''));
      assert.ok(decodedDataParam.startsWith('otpauth://totp/Dev%20Krafters:admin%40devkrafters.com'));
      assert.ok(decodedDataParam.includes(`secret=${testSecret}`));
      assert.ok(decodedDataParam.includes('issuer=Dev%20Krafters'));
      assert.ok(decodedDataParam.includes('algorithm=SHA1'));
      assert.ok(decodedDataParam.includes('digits=6'));
      assert.ok(decodedDataParam.includes('period=30'));
    });

    it('should generate URL with custom account and issuer', () => {
      const customAccount = 'user@example.com';
      const customIssuer = 'Custom App';
      const url = getAuthenticatorQrCodeUrl(testSecret, customAccount, customIssuer);

      const decodedDataParam = decodeURIComponent(url.replace('https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=', ''));
      assert.ok(decodedDataParam.startsWith('otpauth://totp/Custom%20App:user%40example.com'));
      assert.ok(decodedDataParam.includes(`secret=${testSecret}`));
      assert.ok(decodedDataParam.includes('issuer=Custom%20App'));
    });
  });

  describe('DEFAULT_ADMIN_TOTP_SECRET', () => {
    it('should have a default non-empty fallback string', () => {
      assert.strictEqual(typeof DEFAULT_ADMIN_TOTP_SECRET, 'string');
      assert.ok(DEFAULT_ADMIN_TOTP_SECRET.length > 0);
    });
  });
});
