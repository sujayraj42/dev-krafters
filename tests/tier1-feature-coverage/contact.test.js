const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');
const { createJsonRequest } = require('../helpers/mock-request');

const ContactPage = require('@/app/contact/page').default;
const { POST: contactHandler } = require('@/app/api/contact/route');

test('Tier 1: Contact - Renders 4-Step Configurator & Live Smartphone Preview', () => {
  const html = renderComponent(ContactPage);
  const inspector = inspectHtml(html);

  // Title and mode toggle
  assert.ok(inspector.contains('Build Your Business Website'), 'Main heading present');
  assert.ok(inspector.contains('4-Step Visual Configurator'), 'Configurator mode button present');
  assert.ok(inspector.contains('AI Chat Assistant'), 'Chat mode button present');

  // Step 1 Form Controls
  assert.ok(inspector.contains('Your Name'), 'Owner name input label present');
  assert.ok(inspector.contains('Business / Shop Name'), 'Business name input label present');
  assert.ok(inspector.contains('WhatsApp / Mobile Number'), 'Phone input label present');
  assert.ok(inspector.contains('Next Step'), 'Next step CTA present');

  // Smartphone Preview panel
  assert.ok(inspector.contains('DEV KRAFTERS LIVE PREVIEW'), 'Phone header bar present');
  assert.ok(inspector.contains('Installed Features'), 'Installed features label present');
  assert.ok(inspector.contains('Live Calculated Price'), 'Calculated price label present');
});

test('Tier 1: Contact - API POST Handler Accepts Valid Submission and Returns Success', async () => {
  const payload = {
    name: 'Sujay Kumar',
    email: 'sujay@example.com',
    phone: '+919876543210',
    businessType: 'Retail Store',
    projectType: 'Business Website',
    message: 'Need a fast 6-page site with UPI and WhatsApp integration.',
  };

  const req = createJsonRequest('http://localhost/api/contact', 'POST', payload);
  const res = await contactHandler(req);

  assert.strictEqual(res.status, 200, 'Valid submission must return HTTP 200');
  const data = await res.json();
  assert.strictEqual(data.success, true, 'Response body must contain success: true');
  assert.ok(data.mode === 'live' || data.mode === 'demo', 'Response mode must be live or demo');
});
