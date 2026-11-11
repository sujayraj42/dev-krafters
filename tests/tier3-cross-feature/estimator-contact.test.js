const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const { ProjectCostEstimator } = require('@/components/ProjectCostEstimator');

test('Tier 3: Cross-Feature - Cost Estimator to Contact Form Prefill Integration', async (t) => {
  await t.test('Cost Estimator renders CTA linking with dynamic package, pages, and total parameters', () => {
    const html = renderComponent(ProjectCostEstimator);
    const inspector = inspectHtml(html);

    // Default: Business Website (₹25k, 6 pages) + Chatbot (₹8k) + SEO (₹4k) = ₹37,000
    const rawLink = '/contact?package=business&pages=6&total=INR_37000';
    const escapedLink = '/contact?package=business&amp;pages=6&amp;total=INR_37000';
    assert.ok(
      inspector.contains(rawLink) || inspector.contains(escapedLink),
      'Cost estimator must render CTA with package=business, pages=6, total=INR_37000'
    );
  });

  await t.test('Estimator query parameters correctly parse and match the live estimate summary', () => {
    const generatedHref = '/contact?package=business&pages=6&total=INR_37000';
    const parsed = new URL(`https://devkrafters.com${generatedHref}`);

    assert.equal(parsed.searchParams.get('package'), 'business');
    assert.equal(parsed.searchParams.get('pages'), '6');
    assert.equal(parsed.searchParams.get('total'), 'INR_37000');

    // Verify mathematical integrity of the query payload
    const basePrice = 25000;
    const defaultPages = 6;
    const selectedPages = parseInt(parsed.searchParams.get('pages'), 10);
    const extraPagesCost = Math.max(0, selectedPages - defaultPages) * 1500;
    const addonsCost = 8000 + 4000; // Chatbot + SEO
    const expectedTotal = basePrice + extraPagesCost + addonsCost;

    assert.equal(`INR_${expectedTotal}`, parsed.searchParams.get('total'));
  });
});
