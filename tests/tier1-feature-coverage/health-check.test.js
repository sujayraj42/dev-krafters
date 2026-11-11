const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');
const { createJsonRequest } = require('../helpers/mock-request');

const { HealthCheck } = require('@/app/components/HealthCheck');
const { POST: healthCheckHandler } = require('@/app/api/health-check/route');

test('Tier 1: HealthCheck - 8-Parameter Website Diagnostic Engine', async (t) => {
  await t.test('HealthCheck component renders scanner input form and genuine badges', () => {
    const html = renderComponent(HealthCheck);
    const inspector = inspectHtml(html);

    assert.ok(
      inspector.contains('Is Your Website Losing You') || inspector.contains('Website'),
      'Should render health check main headline'
    );
    assert.ok(
      inspector.contains('8-Parameter') || inspector.contains('Scanner'),
      'Should render 8-parameter diagnostic badge'
    );
    assert.ok(
      inspector.contains('placeholder="Enter website URL'),
      'Should render domain URL input field'
    );
  });

  await t.test('/api/health-check rejects missing or invalid URL inputs', async () => {
    // 1. Missing URL
    const emptyReq = createJsonRequest('/api/health-check', { url: '' });
    const emptyRes = await healthCheckHandler(emptyReq);
    assert.equal(emptyRes.status, 400);
    const emptyBody = await emptyRes.json();
    assert.match(emptyBody.error, /valid website URL/i);

    // 2. Non-string URL
    const invalidTypeReq = createJsonRequest('/api/health-check', { url: 12345 });
    const invalidTypeRes = await healthCheckHandler(invalidTypeReq);
    assert.equal(invalidTypeRes.status, 400);

    // 3. Invalid URL protocol/characters
    const malformedReq = createJsonRequest('/api/health-check', { url: 'http://::invalid::' });
    const malformedRes = await healthCheckHandler(malformedReq);
    assert.equal(malformedRes.status, 400);
    const malformedBody = await malformedRes.json();
    assert.match(malformedBody.error, /invalid url/i);
  });

  await t.test('/api/health-check executes genuine 8-parameter inspection on fetched HTML', async () => {
    // Mock globalThis.fetch to return a controlled HTML response
    const originalFetch = globalThis.fetch;
    const mockHtml = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Dev Krafters | Elite Web Studio</title>
          <meta name="description" content="Affordable AI-powered websites for local businesses." />
          <meta property="og:title" content="Dev Krafters" />
          <meta property="og:description" content="Elite web studio" />
        </head>
        <body>
          <h1>Dev Krafters Studio</h1>
          <p>Welcome to our high-converting web engineering studio.</p>
        </body>
      </html>`;

    globalThis.fetch = async (url) => {
      return new Response(mockHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    };

    try {
      const scanReq = createJsonRequest('/api/health-check', { url: 'https://devkrafters.com' });
      const scanRes = await healthCheckHandler(scanReq);
      assert.equal(scanRes.status, 200, 'Successful health check audit should return 200');

      const data = await scanRes.json();
      assert.equal(data.url, 'https://devkrafters.com/');
      assert.ok(typeof data.score === 'number', 'Must return numeric audit score');
      assert.ok(data.score >= 8, `Expected score >= 8 for fully-compliant HTML, got ${data.score}`);

      // Verify all 8 parameter evaluations
      assert.ok(data.checks, 'Must return checks dictionary');
      assert.equal(data.checks.mobileFriendly.pass, true, 'mobileFriendly must pass');
      assert.equal(data.checks.https.pass, true, 'https must pass');
      assert.equal(data.checks.pageSpeed.pass, true, 'pageSpeed must pass');
      assert.equal(data.checks.title.pass, true, 'title must pass');
      assert.equal(data.checks.metaDescription.pass, true, 'metaDescription must pass');
      assert.equal(data.checks.h1Heading.pass, true, 'h1Heading must pass');
      assert.equal(data.checks.html5Doctype.pass, true, 'html5Doctype must pass');
      assert.equal(data.checks.openGraph.pass, true, 'openGraph must pass');

      // Verify plain-English summary is generated
      assert.ok(typeof data.summary === 'string' && data.summary.length > 0, 'Summary report must be populated');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
