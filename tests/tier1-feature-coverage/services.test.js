const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const ServicesPage = require('@/app/services/page').default;

test('Tier 1: Services - Renders All Core Service Offerings & Harmonized Pricing', () => {
  const html = renderComponent(ServicesPage);
  const inspector = inspectHtml(html);

  // Business Websites
  assert.ok(inspector.contains('Business Websites'), 'Service 1: Business Websites title present');
  assert.ok(inspector.contains('₹25,000'), 'Business Websites price ₹25,000 present');
  assert.ok(inspector.contains('10 Days Turnaround'), 'Business Websites timeline 10 days present');

  // Starter Single-Page
  assert.ok(inspector.contains('Starter Single-Page'), 'Service 2: Starter Single-Page title present');
  assert.ok(inspector.contains('₹5,000'), 'Starter Single-Page price ₹5,000 present');
  assert.ok(inspector.contains('3 Days Turnaround'), 'Starter Single-Page timeline 3 days present');

  // E-commerce
  assert.ok(inspector.contains('E-commerce Storefronts'), 'Service 3: E-commerce Storefronts title present');
  assert.ok(inspector.contains('₹75,000'), 'E-commerce price ₹75,000 present');
  assert.ok(inspector.contains('20 Days Turnaround'), 'E-commerce timeline 20 days present');

  // AI Chatbots
  assert.ok(inspector.contains('AI Chatbot Integration'), 'Service 4: AI Chatbot title present');
  assert.ok(inspector.contains('₹8,000'), 'AI Chatbot price ₹8,000 present');
  assert.ok(inspector.contains('5 Days Turnaround'), 'AI Chatbot timeline 5 days present');

  // Database & Backend
  assert.ok(inspector.contains('Database & Backend Setup'), 'Service 5: Database & Backend title present');
  assert.ok(inspector.contains('₹15,000'), 'Database price ₹15,000 present');

  // Local SEO
  assert.ok(inspector.contains('Local SEO & Optimization'), 'Service 6: SEO title present');
  assert.ok(inspector.contains('₹4,000'), 'SEO price ₹4,000 present');

  // Branding
  assert.ok(inspector.contains('Branding & Visual Identity'), 'Service 7: Branding title present');
  assert.ok(inspector.contains('₹6,000'), 'Branding price ₹6,000 present');

  // Maintenance & Care
  assert.ok(inspector.contains('Maintenance & Monthly Care'), 'Service 8: Maintenance title present');
  assert.ok(inspector.contains('₹3,000/mo'), 'Maintenance price ₹3,000/mo present');
});

test('Tier 1: Services - Interactive Recommender Widget & 4-Step Process', () => {
  const html = renderComponent(ServicesPage);
  const inspector = inspectHtml(html);

  // Interactive matcher
  assert.ok(inspector.contains('Find Your Ideal Web Solution'), 'Recommender widget heading present');
  assert.ok(inspector.contains('Fast 1-Page on Budget'), 'Recommender option 1 present');
  assert.ok(inspector.contains('Multi-Page Business Site'), 'Recommender option 2 present');
  assert.ok(inspector.contains('Sell Products Online'), 'Recommender option 3 present');
  assert.ok(inspector.contains('Automated 24/7 Leads'), 'Recommender option 4 present');

  // 4-Step Process
  assert.ok(inspector.contains('How We Build Your Website'), 'Process heading present');
  assert.ok(inspector.contains('Discovery & Fixed Quote'), 'Step 1 present');
  assert.ok(inspector.contains('Design & Rapid Build'), 'Step 2 present');
  assert.ok(inspector.contains('Review & Refine'), 'Step 3 present');
  assert.ok(inspector.contains('Launch & Free Warranty'), 'Step 4 present');
});

test('Tier 1: Services - Category Filter Buttons & Deep Link Routing', () => {
  const html = renderComponent(ServicesPage);
  const inspector = inspectHtml(html);

  // Filter pills
  assert.ok(inspector.contains('Web Design & Stores'), 'Web filter pill present');
  assert.ok(inspector.contains('AI & Chatbots'), 'AI filter pill present');
  assert.ok(inspector.contains('Backend & SEO'), 'Backend filter pill present');
  assert.ok(inspector.contains('Maintenance Care'), 'Care filter pill present');
  assert.ok(inspector.contains('Upcoming Offerings'), 'Upcoming filter pill present');

  // Deep links to contact
  const links = inspector.extractLinks();
  assert.ok(links.some((l) => l.startsWith('/contact?service=')), 'Must link to /contact with service parameter');
});
