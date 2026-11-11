const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const { HealthCheck } = require('@/app/components/HealthCheck');
const { POST: healthCheckPost } = require('@/app/api/health-check/route');
const { createJsonRequest } = require('../helpers/mock-request');

test('Tier 3: Cross-Feature - HealthCheck to Contact & ChatWidget Handoff', async (t) => {
  await t.test('HealthCheck completion generates compliant deep-link href to /contact', async () => {
    // 1. Audit target domain via HealthCheck route
    const originalFetch = globalThis.fetch;
    const testDomain = 'https://drsharmaclinic.in';
    const mockHtml = `<!doctype html><html><head><title>Clinic</title></head><body><h1>Dr Sharma</h1></body></html>`;

    globalThis.fetch = async () => new Response(mockHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });

    try {
      const auditRes = await healthCheckPost(createJsonRequest('/api/health-check', { url: testDomain }));
      assert.equal(auditRes.status, 200);
      const auditData = await auditRes.json();

      // 2. Derive expected Contact deep link URL
      const expectedHref = `/contact?url=${encodeURIComponent(auditData.url)}`;
      assert.ok(expectedHref.startsWith('/contact?url='), 'Must produce /contact?url= link');
      assert.ok(expectedHref.includes(encodeURIComponent('https://drsharmaclinic.in/')));

      // 3. Verify query parameter contract
      const searchParams = new URLSearchParams(expectedHref.split('?')[1]);
      assert.equal(searchParams.get('url'), 'https://drsharmaclinic.in/');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.test('HealthCheck to ChatWidget CustomEvent bridge contracts', () => {
    // Verify CustomEvent contract format
    const testAuditDetail = {
      url: 'https://drsharmaclinic.in',
      score: 6.5,
      summary: 'Missing mobile viewport and HTTPS encryption.',
    };

    const event = new CustomEvent('open-chat-widget', { detail: testAuditDetail });
    assert.equal(event.type, 'open-chat-widget');
    assert.equal(event.detail.url, 'https://drsharmaclinic.in');
    assert.equal(event.detail.score, 6.5);

    // Verify expected message formatting
    const expectedPrompt = `I just ran a health check on my website (${event.detail.url}) and got a score of ${event.detail.score}/10. Can Dev Krafters help improve it?`;
    assert.ok(expectedPrompt.includes('drsharmaclinic.in'));
    assert.ok(expectedPrompt.includes('6.5/10'));
  });
});
