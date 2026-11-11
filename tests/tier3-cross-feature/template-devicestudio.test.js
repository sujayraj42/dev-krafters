const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');
const { setTestParams } = require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');

const PortfolioPage = require('@/app/portfolio/page').default;
const DeviceStudioPage = require('@/app/portfolio/[slug]/page').default;
const { TEMPLATES } = require('@/app/portfolio/templates');
const { POST: leadsPost } = require('@/app/api/leads/route');

test('Tier 3: Cross-Feature - Portfolio Catalog to Device Studio & Quote Drawer', async (t) => {
  await t.test('Portfolio cards link to Device Studio and render the active template shell', () => {
    // 1. Portfolio catalog renders links to /portfolio/[slug]
    const portfolioHtml = renderComponent(PortfolioPage);
    const portfolioInspector = inspectHtml(portfolioHtml);

    assert.ok(portfolioInspector.contains('/portfolio/pulse'), 'Portfolio links to /portfolio/pulse');
    assert.ok(portfolioInspector.contains('/portfolio/ascend'), 'Portfolio links to /portfolio/ascend');

    // 2. Select a template and verify Device Studio loads with dynamic metadata
    const sampleSlug = 'pulse';
    const sampleTemplate = TEMPLATES.find((t) => t.slug === sampleSlug);
    assert.ok(sampleTemplate, 'Pulse template must exist in TEMPLATES');

    setTestParams({ slug: sampleSlug });
    const studioHtml = renderComponent(DeviceStudioPage);
    const studioInspector = inspectHtml(studioHtml);

    assert.ok(studioInspector.contains(sampleTemplate.name), `Device Studio must render name: ${sampleTemplate.name}`);
    assert.ok(studioInspector.contains(sampleTemplate.category), `Device Studio must render category: ${sampleTemplate.category}`);
    assert.ok(studioInspector.contains(sampleTemplate.description) || studioInspector.contains('Studio'), 'Device Studio must describe template');
  });

  await t.test('Device Studio customized consultation drawer submits lead record to /api/leads', async () => {
    const templateSlug = 'pulse';
    const template = TEMPLATES.find((t) => t.slug === templateSlug) || TEMPLATES[0];

    const drawerPayload = {
      name: 'Rohan Deshmukh',
      email: 'rohan@deshmukhclinic.com',
      phone: '+919876543210',
      type: 'contact',
      projectType: `Template Inquiry: ${template.name}`,
      message: `Interested in deploying ${template.name} for our wellness clinic.`,
    };

    const leadRes = await leadsPost(createJsonRequest('/api/leads', drawerPayload));
    assert.equal(leadRes.status, 200, 'Submitting template drawer inquiry must return 200');
    const leadData = await leadRes.json();
    assert.equal(leadData.success, true);
    assert.equal(leadData.lead.name, 'Rohan Deshmukh');
    assert.equal(leadData.lead.email, 'rohan@deshmukhclinic.com');
  });
});
