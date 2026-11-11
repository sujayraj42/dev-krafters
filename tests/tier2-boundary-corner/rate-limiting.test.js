const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');
const { checkRateLimit } = require('@/lib/rateLimit');

const { POST: contactPost } = require('@/app/api/contact/route');
const { POST: healthCheckPost } = require('@/app/api/health-check/route');

test('Tier 2: Boundary - Rate Limiting & DoS Protection (5 req/60s)', async (t) => {
  await t.test('checkRateLimit accurately throttles on the 6th call within window', () => {
    const testId = 'isolated-rate-limit-test-id-' + Date.now();

    for (let i = 1; i <= 5; i++) {
      const result = checkRateLimit(testId, 5, 60000);
      assert.equal(result.success, true, `Call #${i} should succeed`);
      assert.equal(result.remaining, 5 - i);
    }

    // 6th call must be blocked
    const throttled = checkRateLimit(testId, 5, 60000);
    assert.equal(throttled.success, false, '6th call must be throttled');
    assert.equal(throttled.remaining, 0);
    assert.ok(throttled.resetMs > 0 && throttled.resetMs <= 60000);
  });

  await t.test('/api/contact returns HTTP 429 when rate limit is exceeded', async () => {
    const attackIp = '198.51.100.' + (Math.floor(Math.random() * 200) + 1);

    const payload = {
      name: 'Spam Bot',
      email: 'bot@spamdomain.com',
      message: 'Spamming the contact endpoint repeatedly.',
    };

    // Make 5 requests from the exact same IP
    for (let i = 1; i <= 5; i++) {
      const req = createJsonRequest('/api/contact', payload, {
        headers: { 'x-forwarded-for': attackIp },
      });
      const res = await contactPost(req);
      assert.equal(res.status, 200, `Submission ${i} should succeed`);
    }

    // 6th request must receive 429
    const blockedReq = createJsonRequest('/api/contact', payload, {
      headers: { 'x-forwarded-for': attackIp },
    });
    const blockedRes = await contactPost(blockedReq);
    assert.equal(blockedRes.status, 429, '6th submission must receive HTTP 429');
    const blockedBody = await blockedRes.json();
    assert.match(blockedBody.error, /too many/i);
  });

  await t.test('/api/health-check returns HTTP 429 when rate limit is exceeded', async () => {
    const scannerIp = '203.0.113.' + (Math.floor(Math.random() * 200) + 1);

    for (let i = 1; i <= 5; i++) {
      const req = createJsonRequest('/api/health-check', { url: '' }, {
        headers: { 'x-forwarded-for': scannerIp },
      });
      const res = await healthCheckPost(req);
      assert.equal(res.status, 400, `Request ${i} rejected by validation (within rate limit)`);
    }

    // 6th request must trigger 429
    const blockedReq = createJsonRequest('/api/health-check', { url: '' }, {
      headers: { 'x-forwarded-for': scannerIp },
    });
    const blockedRes = await healthCheckPost(blockedReq);
    assert.equal(blockedRes.status, 429, '6th health check call must receive HTTP 429');
    const blockedBody = await blockedRes.json();
    assert.match(blockedBody.error, /too many/i);
  });
});
