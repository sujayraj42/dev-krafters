import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getClientIp, checkRateLimit } from './rateLimit';

describe('getClientIp', () => {
  it('extracts single IP from x-forwarded-for header', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': '203.0.113.195',
      },
    });
    const ip = getClientIp(request);
    assert.equal(ip, '203.0.113.195');
  });

  it('extracts first IP and trims whitespace when x-forwarded-for has multiple IPs', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': ' 198.51.100.1 , 70.41.3.18, 150.172.238.178 ',
      },
    });
    const ip = getClientIp(request);
    assert.equal(ip, '198.51.100.1');
  });

  it('extracts and trims IP from x-real-ip header when x-forwarded-for is absent', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-real-ip': ' 198.51.100.20 ',
      },
    });
    const ip = getClientIp(request);
    assert.equal(ip, '198.51.100.20');
  });

  it('prioritizes x-forwarded-for over x-real-ip when both headers are present', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': '203.0.113.1',
        'x-real-ip': '198.51.100.2',
      },
    });
    const ip = getClientIp(request);
    assert.equal(ip, '203.0.113.1');
  });

  it('returns default 127.0.0.1 when neither header is present', () => {
    const request = new Request('http://localhost/api/test');
    const ip = getClientIp(request);
    assert.equal(ip, '127.0.0.1');
  });
});

describe('checkRateLimit', () => {
  it('allows requests within limit and decrements remaining count', () => {
    const id = `test-user-${Date.now()}-1`;
    const res1 = checkRateLimit(id, 3, 60000);
    assert.equal(res1.success, true);
    assert.equal(res1.limit, 3);
    assert.equal(res1.remaining, 2);

    const res2 = checkRateLimit(id, 3, 60000);
    assert.equal(res2.success, true);
    assert.equal(res2.remaining, 1);

    const res3 = checkRateLimit(id, 3, 60000);
    assert.equal(res3.success, true);
    assert.equal(res3.remaining, 0);
  });

  it('blocks request when limit is exceeded', () => {
    const id = `test-user-${Date.now()}-2`;
    // Make 2 allowed requests
    checkRateLimit(id, 2, 60000);
    checkRateLimit(id, 2, 60000);

    // 3rd request should fail
    const res = checkRateLimit(id, 2, 60000);
    assert.equal(res.success, false);
    assert.equal(res.remaining, 0);
    assert.ok(res.resetMs > 0);
  });

  it('tracks identifiers independently', () => {
    const idA = `user-A-${Date.now()}`;
    const idB = `user-B-${Date.now()}`;

    checkRateLimit(idA, 1, 60000);
    const resA = checkRateLimit(idA, 1, 60000);
    assert.equal(resA.success, false);

    const resB = checkRateLimit(idB, 1, 60000);
    assert.equal(resB.success, true);
  });
});
