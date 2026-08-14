import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { checkRateLimit, getClientIp } from './rateLimit.js';

describe('rateLimit', () => {
  const originalDateNow = Date.now;
  let currentTime = 1000000;

  beforeEach(() => {
    currentTime = 1000000;
    Date.now = () => currentTime;
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  describe('checkRateLimit', () => {
    it('allows requests within the limit and decrements remaining', () => {
      const id = 'user-test-1';
      const result1 = checkRateLimit(id, 3, 60000);
      assert.strictEqual(result1.success, true);
      assert.strictEqual(result1.limit, 3);
      assert.strictEqual(result1.remaining, 2);
      assert.strictEqual(result1.resetMs, 60000);

      const result2 = checkRateLimit(id, 3, 60000);
      assert.strictEqual(result2.success, true);
      assert.strictEqual(result2.remaining, 1);

      const result3 = checkRateLimit(id, 3, 60000);
      assert.strictEqual(result3.success, true);
      assert.strictEqual(result3.remaining, 0);
    });

    it('blocks requests once the limit is exceeded', () => {
      const id = 'user-test-2';
      // Make 3 allowed requests
      for (let i = 0; i < 3; i++) {
        checkRateLimit(id, 3, 60000);
      }

      // 4th request should fail
      const result = checkRateLimit(id, 3, 60000);
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.limit, 3);
      assert.strictEqual(result.remaining, 0);
      assert.strictEqual(result.resetMs, 60000);
    });

    it('resets rate limit window after windowMs passes', () => {
      const id = 'user-test-3';
      const windowMs = 60000;

      for (let i = 0; i < 3; i++) {
        checkRateLimit(id, 3, windowMs);
      }

      // Blocked at current time
      assert.strictEqual(checkRateLimit(id, 3, windowMs).success, false);

      // Advance time past windowMs
      currentTime += windowMs + 1;

      // Should succeed now
      const result = checkRateLimit(id, 3, windowMs);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.remaining, 2);
    });

    it('calculates resetMs correctly when rate limited', () => {
      const id = 'user-test-4';
      const windowMs = 60000;

      // First request at t = 1000000
      checkRateLimit(id, 2, windowMs);

      // Second request at t = 1010000 (10s later)
      currentTime += 10000;
      checkRateLimit(id, 2, windowMs);

      // Third request at t = 1020000 (20s after first request) -> blocked
      currentTime += 10000;
      const result = checkRateLimit(id, 2, windowMs);
      assert.strictEqual(result.success, false);
      // oldest timestamp is 1000000, current time is 1020000 -> 20000ms elapsed.
      // resetMs should be windowMs - 20000 = 40000
      assert.strictEqual(result.resetMs, 40000);
    });

    it('isolates rate limits by identifier', () => {
      const id1 = 'user-a';
      const id2 = 'user-b';

      for (let i = 0; i < 2; i++) {
        checkRateLimit(id1, 2, 60000);
      }

      assert.strictEqual(checkRateLimit(id1, 2, 60000).success, false);
      assert.strictEqual(checkRateLimit(id2, 2, 60000).success, true);
    });

    it('uses default parameter values when limit and windowMs are omitted', () => {
      const id = 'user-default-params';
      // Default limit is 5, windowMs is 60000
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit(id);
        assert.strictEqual(res.success, true);
        assert.strictEqual(res.limit, 5);
      }
      const blocked = checkRateLimit(id);
      assert.strictEqual(blocked.success, false);
    });
  });

  describe('getClientIp', () => {
    it('returns first IP from x-forwarded-for header', () => {
      const headers = new Headers({
        'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
      });
      const req = new Request('https://example.com', { headers });
      assert.strictEqual(getClientIp(req), '203.0.113.195');
    });

    it('returns x-real-ip header if x-forwarded-for is missing', () => {
      const headers = new Headers({
        'x-real-ip': '198.51.100.1',
      });
      const req = new Request('https://example.com', { headers });
      assert.strictEqual(getClientIp(req), '198.51.100.1');
    });

    it('returns default fallback IP 127.0.0.1 if headers are missing', () => {
      const req = new Request('https://example.com');
      assert.strictEqual(getClientIp(req), '127.0.0.1');
    });
  });
});
