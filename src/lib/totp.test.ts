import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTotpCode,
  verifyTotpCode,
  getAuthenticatorQrCodeUrl,
  DEFAULT_ADMIN_TOTP_SECRET,
} from './totp.js';

describe('TOTP Module (src/lib/totp.ts)', () => {
  let originalDateNow: typeof Date.now;

  beforeEach(() => {
    originalDateNow = Date.now;
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  function mockTimestamp(timestampMs: number) {
    Date.now = () => timestampMs;
  }

  describe('generateTotpCode', () => {
    // Standard RFC 6238 Base32 test key: "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
    const testSecret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

    test('generates valid 6-digit TOTP code for a fixed timestamp', async () => {
      // 59 seconds Unix timestamp -> timeStep = Math.floor(59 / 30) = 1
      mockTimestamp(59000);
      const code = await generateTotpCode(testSecret);

      assert.equal(typeof code, 'string');
      assert.equal(code.length, 6);
      assert.match(code, /^\d{6}$/);
      // For key GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ at t=59s (timeStep = 1), expected HMAC output calculation yields "287082"
      assert.equal(code, '287082');
    });

    test('handles zero-padding correctly for codes starting with 0', async () => {
      // Time step window 37037037 (timestamp 1111111111s) -> code calculated is "050471"
      mockTimestamp(1111111111000);
      const code = await generateTotpCode(testSecret);

      assert.equal(code.length, 6);
      assert.match(code, /^\d{6}$/);
      assert.ok(code.startsWith('0'));
      assert.equal(code, '050471');
    });

    test('supports timeStepWindow parameter (-1, 0, +1)', async () => {
      // Base time: 1000000000s -> timeStep = 33333333
      mockTimestamp(1000000000000);

      const currentCode = await generateTotpCode(testSecret, 0);
      const prevCode = await generateTotpCode(testSecret, -1);
      const nextCode = await generateTotpCode(testSecret, +1);

      assert.match(currentCode, /^\d{6}$/);
      assert.match(prevCode, /^\d{6}$/);
      assert.match(nextCode, /^\d{6}$/);

      // Verify that code for time window -1 matches code generated at 30 seconds earlier
      mockTimestamp(1000000000000 - 30000);
      const expectedPrevCode = await generateTotpCode(testSecret, 0);
      assert.equal(prevCode, expectedPrevCode);

      // Verify that code for time window +1 matches code generated at 30 seconds later
      mockTimestamp(1000000000000 + 30000);
      const expectedNextCode = await generateTotpCode(testSecret, 0);
      assert.equal(nextCode, expectedNextCode);
    });

    test('normalizes secrets with lowercase, spaces, or hyphens', async () => {
      mockTimestamp(1600000000000);

      const codeStandard = await generateTotpCode(DEFAULT_ADMIN_TOTP_SECRET);
      const codeWithSpaces = await generateTotpCode(
        `  ${DEFAULT_ADMIN_TOTP_SECRET.toLowerCase().slice(0, 8)} - ${DEFAULT_ADMIN_TOTP_SECRET.slice(8)}  `
      );

      assert.equal(codeStandard, codeWithSpaces);
    });
  });

  describe('verifyTotpCode', () => {
    const secret = 'JBSWY3DPEHPK3PXP'; // Base32 for "Hello!"

    test('returns true for correct token in current time window', async () => {
      mockTimestamp(1700000000000);
      const validCode = await generateTotpCode(secret);

      const isValid = await verifyTotpCode(validCode, secret);
      assert.equal(isValid, true);
    });

    test('returns true for correct token in previous (-30s) or next (+30s) window', async () => {
      mockTimestamp(1700000000000);
      const prevCode = await generateTotpCode(secret, -1);
      const nextCode = await generateTotpCode(secret, 1);

      assert.equal(await verifyTotpCode(prevCode, secret), true);
      assert.equal(await verifyTotpCode(nextCode, secret), true);
    });

    test('returns false for token outside allowed window (+/- 1 window)', async () => {
      mockTimestamp(1700000000000);
      const farPastCode = await generateTotpCode(secret, -2);
      const farFutureCode = await generateTotpCode(secret, 2);

      assert.equal(await verifyTotpCode(farPastCode, secret), false);
      assert.equal(await verifyTotpCode(farFutureCode, secret), false);
    });

    test('returns false for invalid inputs (wrong digits, formatted improperly, wrong length)', async () => {
      mockTimestamp(1700000000000);

      assert.equal(await verifyTotpCode('12345', secret), false);
      assert.equal(await verifyTotpCode('1234567', secret), false);
      assert.equal(await verifyTotpCode('abcdef', secret), false);
      assert.equal(await verifyTotpCode('', secret), false);
      assert.equal(await verifyTotpCode('      ', secret), false);
    });

    test('trims spaces around token before verification', async () => {
      mockTimestamp(1700000000000);
      const validCode = await generateTotpCode(secret);

      assert.equal(await verifyTotpCode(`  ${validCode}  `, secret), true);
    });
  });

  describe('getAuthenticatorQrCodeUrl', () => {
    test('generates valid QR code URL with encoded parameters', () => {
      const secret = 'DEVKRAFTERS2FASECRET32';
      const accountName = 'admin@devkrafters.com';
      const issuer = 'Dev Krafters';

      const qrUrl = getAuthenticatorQrCodeUrl(secret, accountName, issuer);

      assert.ok(qrUrl.startsWith('https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='));

      const rawDataParam = qrUrl.split('data=')[1];
      const decodedDataParam = decodeURIComponent(rawDataParam);

      assert.ok(decodedDataParam.startsWith('otpauth://totp/'));
      assert.ok(decodedDataParam.includes('secret=DEVKRAFTERS2FASECRET32'));
      assert.ok(decodedDataParam.includes('algorithm=SHA1'));
      assert.ok(decodedDataParam.includes('digits=6'));
      assert.ok(decodedDataParam.includes('period=30'));
    });

    test('uses default parameters when optional arguments are omitted', () => {
      const qrUrl = getAuthenticatorQrCodeUrl('TESTSECRET');
      const decodedDataParam = decodeURIComponent(qrUrl.split('data=')[1]);

      assert.ok(decodedDataParam.includes('admin%40devkrafters.com'));
      assert.ok(decodedDataParam.includes('secret=TESTSECRET'));
    });
  });
});
