const test = require('node:test');
const assert = require('node:assert');
const { setTestParams, resetTestNavigation } = require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const TemplatePreviewPage = require('@/app/portfolio/[slug]/page').default;
const { getTemplateMeta } = require('@/app/portfolio/templates');

test('Tier 1: Device Studio - Renders Hardware Studio with Viewport Mode Controls', () => {
  setTestParams({ slug: 'pulse' });
  const meta = getTemplateMeta('pulse');
  const html = renderComponent(TemplatePreviewPage);
  const inspector = inspectHtml(html);

  // Template name & identity
  assert.ok(inspector.contains('Pulse'), 'Template name Pulse rendered');
  assert.ok(inspector.contains(meta.category), `Category ${meta.category} rendered`);

  // Viewport switcher controls
  assert.ok(inspector.contains('Desktop'), 'Desktop viewport mode button present');
  assert.ok(inspector.contains('Tablet'), 'Tablet viewport mode button present');
  assert.ok(inspector.contains('Mobile'), 'Mobile viewport mode button present');
  assert.ok(inspector.contains('Fluid'), 'Fluid viewport mode button present');

  // Interactive buttons
  assert.ok(inspector.contains('Customize This'), 'Customize CTA present');
  assert.ok(inspector.contains('Template Specs'), 'Template Specs trigger present');
  resetTestNavigation();
});

test('Tier 1: Device Studio - Non-Existent Template Slug Triggers 404 Fallback', () => {
  setTestParams({ slug: 'unknown-nonexistent-template-xyz' });
  const html = renderComponent(TemplatePreviewPage);
  const inspector = inspectHtml(html);

  assert.ok(inspector.contains('Template Not Found'), 'Must display "Template Not Found"');
  assert.ok(inspector.contains('Back to Showcase'), 'Must provide link back to showcase');
  assert.ok(inspector.extractLinks().includes('/portfolio'), 'Must link to /portfolio');
  resetTestNavigation();
});

test('Tier 1: Device Studio - Renders Multiple Distinct Templates Correctly', () => {
  const testSlugs = ['ascend', 'studio-noir', 'loam', 'roots'];

  for (const slug of testSlugs) {
    setTestParams({ slug });
    const html = renderComponent(TemplatePreviewPage);
    const inspector = inspectHtml(html);

    assert.ok(!inspector.contains('Template Not Found'), `Template "${slug}" must render without 404`);
    assert.ok(inspector.contains('devkrafters.com/portfolio/' + slug), `Browser address bar chip contains slug`);
  }
  resetTestNavigation();
});
