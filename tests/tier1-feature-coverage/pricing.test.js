const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const PricingPage = require('@/app/pricing/page').default;

test('Tier 1: Pricing - All 5 Fixed Packages Rendered with Accurate Pricing & Badges', () => {
  const html = renderComponent(PricingPage);
  const inspector = inspectHtml(html);

  // Package 1: Starter Page
  assert.ok(inspector.contains('Starter Page'), 'Package 1 name present');
  assert.ok(inspector.contains('₹5,000'), 'Starter Page price ₹5,000 present');
  assert.ok(inspector.contains('3-Day Delivery'), 'Starter Page delivery 3 days present');
  assert.ok(inspector.contains('Fast Launch'), 'Starter Page badge present');

  // Package 2: Landing Page
  assert.ok(inspector.contains('Landing Page'), 'Package 2 name present');
  assert.ok(inspector.contains('₹9,000'), 'Landing Page price ₹9,000 present');
  assert.ok(inspector.contains('5-Day Delivery'), 'Landing Page delivery 5 days present');

  // Package 3: Business Website (Most Popular)
  assert.ok(inspector.contains('Business Website'), 'Package 3 name present');
  assert.ok(inspector.contains('₹25,000'), 'Business Website price ₹25,000 present');
  assert.ok(inspector.contains('10-Day Delivery'), 'Business Website delivery 10 days present');
  assert.ok(inspector.contains('Most Popular'), 'Business Website Most Popular badge present');

  // Package 4: E-commerce Store
  assert.ok(inspector.contains('E-commerce Store'), 'Package 4 name present');
  assert.ok(inspector.contains('₹75,000'), 'E-commerce price ₹75,000 present');
  assert.ok(inspector.contains('20-Day Delivery'), 'E-commerce delivery 20 days present');

  // Package 5: Monthly Care Plan
  assert.ok(inspector.contains('Monthly Care Plan'), 'Package 5 name present');
  assert.ok(inspector.contains('₹3,000'), 'Care Plan price ₹3,000 present');
  assert.ok(inspector.contains('/ month'), 'Care Plan recurring unit present');
});

test('Tier 1: Pricing - Side-by-Side Comparison Matrix & Warranty Terms', () => {
  const html = renderComponent(PricingPage);
  const inspector = inspectHtml(html);

  assert.ok(inspector.contains('Compare All Packages Side-by-Side'), 'Comparison matrix title present');
  assert.ok(inspector.contains('Number of Pages'), 'Matrix feature 1 present');
  assert.ok(inspector.contains('Delivery Time'), 'Matrix feature 2 present');
  assert.ok(inspector.contains('Free Bug-Fix Warranty'), 'Matrix warranty row present');
  assert.ok(inspector.contains('Payment Gateway (Razorpay/Stripe)'), 'Payment gateway row present');
});

test('Tier 1: Pricing - 100% Transparency Disclosure (What is Not Included)', () => {
  const html = renderComponent(PricingPage);
  const inspector = inspectHtml(html);

  assert.ok(inspector.contains('What is Not Included'), 'Not included section heading present');
  assert.ok(inspector.contains('Domain registration fees'), 'Domain fee disclosure present');
  assert.ok(inspector.contains('Hosting server costs'), 'Hosting cost disclosure present');
  assert.ok(inspector.contains('Professional copywriting'), 'Copywriting disclosure present');
});

test('Tier 1: Pricing - FAQ Section & Package Deep Links to Contact', () => {
  const html = renderComponent(PricingPage);
  const inspector = inspectHtml(html);

  // FAQs
  assert.ok(inspector.contains('Frequently Asked Questions'), 'FAQ heading present');
  assert.ok(inspector.contains('Are there any hidden or recurring charges?'), 'FAQ 1 question present');

  // Deep links
  const links = inspector.extractLinks();
  assert.ok(links.includes('/contact?package=starter-page'), 'Links to /contact for starter');
  assert.ok(links.includes('/contact?package=landing-page'), 'Links to /contact for landing');
  assert.ok(links.includes('/contact?package=business-website'), 'Links to /contact for business');
  assert.ok(links.includes('/contact?package=ecommerce'), 'Links to /contact for ecommerce');
});
