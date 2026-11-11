const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');
const { setTestParams } = require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');

const PortfolioPage = require('@/app/portfolio/page').default;
const DeviceStudioPage = require('@/app/portfolio/[slug]/page').default;
const { POST: leadsPost } = require('@/app/api/leads/route');

test('Tier 4: Journey 3 - Startup Founder Template Exploration to Custom Consultation', async (t) => {
  await t.test('Browses templates, examines Device Studio preview, and submits customized consultation inquiry', async () => {
    // 1. Founder visits portfolio catalog
    const catalogHtml = renderComponent(PortfolioPage);
    const catalogInspector = inspectHtml(catalogHtml);

    assert.ok(catalogInspector.contains('Template Gallery') || catalogInspector.contains('Templates') || catalogInspector.contains('Portfolio'), 'Catalog heading present');
    assert.ok(catalogInspector.contains('/portfolio/pulse'), 'Must list Pulse template card');

    // 2. Selects Pulse template and inspects Device Studio
    setTestParams({ slug: 'pulse' });
    const studioHtml = renderComponent(DeviceStudioPage);
    const studioInspector = inspectHtml(studioHtml);

    assert.ok(studioInspector.contains('Pulse'), 'Template name rendered');
    assert.ok(studioInspector.contains('Desktop'), 'Hardware viewport selector present');
    assert.ok(studioInspector.contains('Mobile'), 'Mobile frame selector present');

    // 3. Founder opens inquiry drawer and submits custom integration request
    const inquiryPayload = {
      type: 'contact',
      name: 'Vikram Aditya (Zenith Tech)',
      email: 'vikram@zenithtech.io',
      phone: '+919876533333',
      projectType: 'Template Customization: Pulse',
      budget: '₹50,000 - ₹1,00,000',
      message: 'Love the Pulse dashboard aesthetic. Need custom backend webhooks and Razorpay billing integration.',
    };

    const inquiryRes = await leadsPost(createJsonRequest('/api/leads', inquiryPayload));
    assert.equal(inquiryRes.status, 200, 'Submitting consultation inquiry must return 200');
    const inquiryData = await inquiryRes.json();
    assert.equal(inquiryData.success, true);
    assert.equal(inquiryData.lead.name, 'Vikram Aditya (Zenith Tech)');
  });
});
