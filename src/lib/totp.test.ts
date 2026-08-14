import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { generateTotpCode } from './totp.ts';

describe('generateTotpCode', () => {
  const originalDateNow = Date.now;
  const mockTimestampMs = 1700000000000; // Fixed timestamp in ms (1700000000 seconds)
  const secret = 'JBSWY3DPEHPK3PXP'; // Standard RFC 4648 base32 test secret

  beforeEach(() => {
    Date.now = () => mockTimestampMs;
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  it('should generate a 6-digit TOTP code string', async () => {
    const code = await generateTotpCode(secret);
    assert.strictEqual(typeof code, 'string');
    assert.strictEqual(code.length, 6);
    assert.match(code, /^\d{6}$/);
  });

  it('should generate a consistent TOTP code for the same time and secret', async () => {
    const code1 = await generateTotpCode(secret);
    const code2 = await generateTotpCode(secret);
    assert.strictEqual(code1, code2);
  });

  it('should generate different TOTP codes for different secrets at the same time', async () => {
    const secret2 = 'K5XGW4TBO5XCA2DF';
    const code1 = await generateTotpCode(secret);
    const code2 = await generateTotpCode(secret2);
    assert.notStrictEqual(code1, code2);
  });

  it('should generate different TOTP codes for different timeStepWindow offsets', async () => {
    const codeCurrent = await generateTotpCode(secret, 0);
    const codePrev = await generateTotpCode(secret, -1);
    const codeNext = await generateTotpCode(secret, 1);

    assert.notStrictEqual(codeCurrent, codePrev);
    assert.notStrictEqual(codeCurrent, codeNext);
    assert.notStrictEqual(codePrev, codeNext);
  });

  it('should pad OTP codes with leading zeros when numeric value is less than 100000', async () => {
    // Generate codes for multiple time offsets to ensure proper length formatting regardless of integer value
    for (let window = -10; window <= 10; window++) {
      const code = await generateTotpCode(secret, window);
      assert.strictEqual(code.length, 6);
      assert.match(code, /^\d{6}$/);
    }
  });
});
