const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const { ProjectCostEstimator } = require('@/components/ProjectCostEstimator');

test('Tier 1: CostEstimator - Interactive Pricing Engine & Live Quote Generator', async (t) => {
  await t.test('Renders packages, addon options, and default calculated quote', () => {
    const html = renderComponent(ProjectCostEstimator);
    const inspector = inspectHtml(html);

    // 1. Verify Packages
    assert.ok(inspector.contains('Starter Page'), 'Starter Page package present');
    assert.ok(inspector.contains('5,000'), 'Starter Page price ₹5,000 present');
    assert.ok(inspector.contains('Landing Page'), 'Landing Page package present');
    assert.ok(inspector.contains('9,000'), 'Landing Page price ₹9,000 present');
    assert.ok(inspector.contains('Business Website'), 'Business Website package present');
    assert.ok(inspector.contains('25,000'), 'Business Website price ₹25,000 present');
    assert.ok(inspector.contains('E-commerce Store'), 'E-commerce Store package present');
    assert.ok(inspector.contains('75,000'), 'E-commerce Store price ₹75,000 present');

    // 2. Verify Addon Options
    assert.ok(inspector.contains('24/7 AI Lead Chatbot'), 'Chatbot addon present');
    assert.ok(inspector.contains('8,000'), 'Chatbot price ₹8,000 present');
    assert.ok(inspector.contains('Google Business & Local SEO Boost'), 'SEO addon present');
    assert.ok(inspector.contains('4,000'), 'SEO price ₹4,000 present');
    assert.ok(inspector.contains('Monthly Care & Support Plan'), 'Monthly Care addon present');

    // 3. Verify Default Calculations (Business 25k + Chatbot 8k + SEO 4k = 37k)
    assert.ok(inspector.contains('37,000'), 'Default calculated total ₹37,000 present');

    // 4. Verify Contact Prefill Link
    assert.ok(
      inspector.contains('/contact?package=business&amp;pages=6&amp;total=INR_37000') ||
        inspector.contains('/contact?package=business&pages=6&total=INR_37000'),
      'CTA link must prefill Contact page with selected package, pages, and total'
    );

    // 5. Verify Guarantees
    assert.ok(inspector.contains('100% Fixed Price Guarantee'), 'Fixed price guarantee badge present');
  });
});
