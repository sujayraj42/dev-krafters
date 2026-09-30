import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit, getClientIp } from './rateLimit';

describe('getClientIp', () => {
  test('returns first IP from x-forwarded-for header', () => {
    const req = new Request('https://example.com', {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
      },
    });
    const ip = getClientIp(req);
    assert.equal(ip, '203.0.113.195');
  });

  test('trims whitespace from x-forwarded-for IP', () => {
    const req = new Request('https://example.com', {
      headers: {
        'x-forwarded-for': '   198.51.100.1  , 70.41.3.18',
      },
    });
    const ip = getClientIp(req);
    assert.equal(ip, '198.51.100.1');
  });

  test('returns x-real-ip header when x-forwarded-for is missing', () => {
    const req = new Request('https://example.com', {
      headers: {
        'x-real-ip': '  198.51.100.22  ',
      },
    });
    const ip = getClientIp(req);
    assert.equal(ip, '198.51.100.22');
  });

  test('falls back to 127.0.0.1 when no IP headers present', () => {
    const req = new Request('https://example.com');
    const ip = getClientIp(req);
    assert.equal(ip, '127.0.0.1');
  });
});

describe('checkRateLimit', () => {
  test('allows requests within limit and decrements remaining count', () => {
    const id = 'test-ip-allow-' + Date.now();
    const result1 = checkRateLimit(id, 3, 60000);
    assert.equal(result1.success, true);
    assert.equal(result1.limit, 3);
    assert.equal(result1.remaining, 2);

    const result2 = checkRateLimit(id, 3, 60000);
    assert.equal(result2.success, true);
    assert.equal(result2.remaining, 1);

    const result3 = checkRateLimit(id, 3, 60000);
    assert.equal(result3.success, true);
    assert.equal(result3.remaining, 0);
  });

  test('blocks requests exceeding limit', () => {
    const id = 'test-ip-block-' + Date.now();
    for (let i = 0; i < 3; i++) {
      checkRateLimit(id, 3, 60000);
    }

    const blockedResult = checkRateLimit(id, 3, 60000);
    assert.equal(blockedResult.success, false);
    assert.equal(blockedResult.remaining, 0);
    assert.equal(blockedResult.limit, 3);
    assert.ok(blockedResult.resetMs <= 60000 && blockedResult.resetMs > 0);
  });

  test('resets limit after windowMs passes', (t) => {
    t.mock.timers.enable({ apis: ['Date'] });
    const id = 'test-ip-window-' + Math.random();

    // Consume all rate limit allowances
    checkRateLimit(id, 2, 1000);
    checkRateLimit(id, 2, 1000);

    const blocked = checkRateLimit(id, 2, 1000);
    assert.equal(blocked.success, false);

    // Advance mock time past windowMs (1000 ms)
    t.mock.timers.tick(1001);

    const allowedAfterWindow = checkRateLimit(id, 2, 1000);
    assert.equal(allowedAfterWindow.success, true);
    assert.equal(allowedAfterWindow.remaining, 1);
  });

  test('isolates limits across different identifiers', () => {
    const idA = 'user-A-' + Math.random();
    const idB = 'user-B-' + Math.random();

    // Exhaust limit for user A
    for (let i = 0; i < 2; i++) {
      checkRateLimit(idA, 2, 60000);
    }
    const blockedA = checkRateLimit(idA, 2, 60000);
    assert.equal(blockedA.success, false);

    // User B should still be allowed
    const allowedB = checkRateLimit(idB, 2, 60000);
    assert.equal(allowedB.success, true);
    assert.equal(allowedB.remaining, 1);
  });
});
