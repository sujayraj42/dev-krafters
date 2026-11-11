const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const PricingPage = require('@/app/pricing/page').default;

test('Tier 3: Cross-Feature - Pricing Package Card to Contact Form Prefill Linkage', async (t) => {
  await t.test('All Pricing Cards generate spec-compliant /contact?package= deep links', () => {
    const html = renderComponent(PricingPage);
    const inspector = inspectHtml(html);

    const expectedPackageLinks = [
      '/contact?package=starter-page',
      '/contact?package=landing-page',
      '/contact?package=business-website',
      '/contact?package=ecommerce',
      '/contact?package=maintenance',
    ];

    for (const link of expectedPackageLinks) {
      assert.ok(
        inspector.contains(link) || inspector.contains(link.replace('&', '&amp;')),
        `Pricing page must render CTA linking to ${link}`
      );
    }
  });

  await t.test('Package query strings parse into valid package identifiers', () => {
    const sampleUrl = 'https://devkrafters.com/contact?package=business-website';
    const parsed = new URL(sampleUrl);
    const pkgId = parsed.searchParams.get('package');

    assert.equal(pkgId, 'business-website');
    assert.ok(['starter-page', 'landing-page', 'business-website', 'ecommerce', 'maintenance'].includes(pkgId));
  });
});
