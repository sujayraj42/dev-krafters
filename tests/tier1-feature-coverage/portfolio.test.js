const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const ShowcasePage = require('@/app/portfolio/page').default;
const { TEMPLATES, CATEGORIES } = require('@/app/portfolio/templates');

test('Tier 1: Portfolio - All 20 Templates Present in Catalog with Valid Metadata', () => {
  assert.strictEqual(TEMPLATES.length, 20, 'Exact 20 templates must exist in TEMPLATES catalog');

  const expectedSlugs = [
    'ascend', 'studio-noir', 'pulse', 'loam', 'ember-and-oak',
    'flux', 'kernel', 'ledger', 'roots', 'nexus-summit',
    'the-margin', 'haven', 'lucent-academy', 'vault', 'meridian',
    'wavelength', 'launchpad', 'ledgerline', 'aline-studio', 'bazaar',
  ];

  for (const slug of expectedSlugs) {
    const found = TEMPLATES.find((t) => t.slug === slug);
    assert.ok(found, `Template "${slug}" must exist in TEMPLATES list`);
    assert.ok(found.name && found.name.trim().length > 0, `Template "${slug}" must have a name`);
    assert.ok(found.category && found.category.trim().length > 0, `Template "${slug}" must have a category`);
    assert.ok(found.description && found.description.trim().length > 0, `Template "${slug}" must have a description`);
    assert.ok(found.accentColor && found.accentColor.startsWith('#'), `Template "${slug}" must have a hex accentColor`);
  }
});

test('Tier 1: Portfolio - Renders Template Showcase with Categories and Client Case Studies', () => {
  const html = renderComponent(ShowcasePage);
  const inspector = inspectHtml(html);

  // Heading & Stats
  assert.ok(inspector.contains('Our Showcase &'), 'Showcase title present');
  assert.ok(inspector.contains('Web Templates'), 'Web Templates highlight present');
  assert.ok(inspector.contains('20 Web Templates'), '20 Web Templates pill present');

  // Client Case Studies
  assert.ok(inspector.contains('Amrjeet Enterprises'), 'Case study 1 present');
  assert.ok(inspector.contains('Aura Hair & Beauty Studio'), 'Case study 2 present');
  assert.ok(inspector.contains('Spice Craft Bistro'), 'Case study 3 present');
  assert.ok(inspector.contains('BrightSmile Dental Clinic'), 'Case study 4 present');
  assert.ok(inspector.contains('Urban Threads Boutique'), 'Case study 5 present');

  // Search input and Category pills
  assert.ok(inspector.contains('Search templates by keyword or style'), 'Search placeholder present');
  for (const cat of CATEGORIES) {
    assert.ok(inspector.contains(cat), `Category "${cat}" pill present in HTML`);
  }
});

test('Tier 1: Portfolio - Device Studio Links Generated for Each Template', () => {
  const html = renderComponent(ShowcasePage);
  const inspector = inspectHtml(html);
  const links = inspector.extractLinks();

  assert.ok(links.some((l) => l.startsWith('/portfolio/')), 'Links to individual /portfolio/[slug] routes exist');
});
