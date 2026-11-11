const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');
const { sanitizeText } = require('@/lib/sanitize');

const { POST: contactPost } = require('@/app/api/contact/route');
const { POST: leadsPost } = require('@/app/api/leads/route');

test('Tier 2: Boundary - Phone Number Formatting & Sanitization', async (t) => {
  await t.test('sanitizeText safely normalizes spaced and formatted phone numbers', () => {
    // 1. Spaced Indian mobile number
    const spaced = sanitizeText('+91 98765 43210', 30);
    assert.equal(spaced, '+91 98765 43210');

    // 2. US Landline with parentheses and dashes
    const formatted = sanitizeText('(080) 2345-6789', 30);
    assert.equal(formatted, '(080) 2345-6789');

    // 3. Excessively long input truncated safely to 30 chars
    const overlyLong = '+91 98765 43210 1234567890 0987654321';
    const truncated = sanitizeText(overlyLong, 30);
    assert.equal(truncated.length, 30);
    assert.equal(truncated, overlyLong.slice(0, 30));
  });

  await t.test('/api/leads accepts phone-only lead without email', async () => {
    const leadReq = createJsonRequest('/api/leads', {
      name: 'Ramesh Patel',
      phone: '+91 98765 43210',
      type: 'contact',
      message: 'Quick inquiry via WhatsApp phone.',
    });

    const leadRes = await leadsPost(leadReq);
    assert.equal(leadRes.status, 200);
    const body = await leadRes.json();
    assert.equal(body.success, true);
    assert.equal(body.lead.phone, '+91 98765 43210');
  });

  await t.test('/api/contact retains formatted phone with valid submission', async () => {
    const contactReq = createJsonRequest('/api/contact', {
      name: 'Anita Verma',
      email: 'anita@vermajewels.in',
      phone: '+91 98765 00000',
      message: 'Need an e-commerce catalogue for jewellery.',
    });

    const contactRes = await contactPost(contactReq);
    assert.equal(contactRes.status, 200);
    const body = await contactRes.json();
    assert.equal(body.success, true);
  });
});
