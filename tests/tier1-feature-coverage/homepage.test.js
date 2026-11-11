const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');
const { validateSemanticHtml } = require('../helpers/dom-utils');

// Require Homepage Component
const Home = require('@/app/page').default;

test('Tier 1: Homepage - Renders 3D Hero Shell with Heading and CTAs', () => {
  const html = renderComponent(Home);
  const inspector = inspectHtml(html);

  // Hero title and value proposition
  assert.ok(inspector.contains('Websites that feel'), 'Hero must contain "Websites that feel"');
  assert.ok(inspector.contains('alive'), 'Hero must contain "alive" highlight text');
  assert.ok(inspector.contains('Digital experiences for ambitious local brands'), 'Kicker text present');

  // Key CTAs
  const links = inspector.extractLinks();
  assert.ok(links.includes('/contact'), 'Hero must link to /contact');
  assert.ok(links.includes('/portfolio'), 'Hero must link to /portfolio');
});

test('Tier 1: Homepage - Features Agency Comparison Matrix', () => {
  const html = renderComponent(Home);
  const inspector = inspectHtml(html);

  assert.ok(inspector.contains('Traditional Agencies vs. Dev Krafters'), 'Comparison section heading present');
  assert.ok(inspector.contains('₹5,000 – ₹25,000 (100% Fixed Price)'), 'Dev Krafters fixed price model highlighted');
  assert.ok(inspector.contains('3 to 10 Days (Rapid AI-assisted build)'), 'Dev Krafters 3-10 day turnaround highlighted');
  assert.ok(inspector.contains('Direct Access to Our Engineering Team'), 'Direct team access highlighted');
  assert.ok(inspector.contains('15-30 Days Free Warranty Included'), 'Free post-launch warranty highlighted');
});

test('Tier 1: Homepage - Value Propositions and Testimonials Rendered', () => {
  const html = renderComponent(Home);
  const inspector = inspectHtml(html);

  // Value props
  assert.ok(inspector.contains('Affordable, Fixed Pricing'), 'Value prop 1 present');
  assert.ok(inspector.contains('AI-Powered Rapid Build'), 'Value prop 2 present');
  assert.ok(inspector.contains('Direct Engineering Access'), 'Value prop 3 present');
  assert.ok(inspector.contains('Support & Free Warranty'), 'Value prop 4 present');

  // Client proofs / testimonials
  assert.ok(inspector.contains('Salon & Wellness Studio Solution'), 'Testimonial 1 present');
  assert.ok(inspector.contains('Bistro & Hospitality Solution'), 'Testimonial 2 present');
  assert.ok(inspector.contains('Healthcare Clinic Solution'), 'Testimonial 3 present');
});

test('Tier 1: Homepage - Featured Templates Showcase Present', () => {
  const html = renderComponent(Home);
  const inspector = inspectHtml(html);

  assert.ok(inspector.contains('Featured Web Templates'), 'Featured templates heading present');
  assert.ok(inspector.contains('View All 20 Templates'), 'Link to portfolio present');
  assert.ok(inspector.extractLinks().includes('/portfolio'), 'Links to /portfolio');
});

// Implementation defect tracked under PROJECT.md Feature 5 (Fix ShimmerButton in src/components/PremiumEffects.tsx)
test('Tier 1: Homepage - Semantic HTML Validation (No button inside link)', { todo: 'Pending M1 implementation of Feature 5 (Valid HTML Nesting)' }, () => {
  const html = renderComponent(Home);
  const semantic = validateSemanticHtml(html);
  assert.strictEqual(semantic.valid, true, `Semantic HTML issues detected: ${semantic.issues.join(', ')}`);
});
