const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');

const { POST: contactPost } = require('@/app/api/contact/route');
const { POST: leadsPost } = require('@/app/api/leads/route');
const { POST: healthCheckPost } = require('@/app/api/health-check/route');
const { POST: chatPost } = require('@/app/api/chat/route');

test('Tier 2: Boundary - Empty Inputs & Missing Payload Field Validation', async (t) => {
  await t.test('/api/contact rejects empty bodies and partial required fields with HTTP 400', async () => {
    // 1. Completely empty body
    const emptyRes = await contactPost(createJsonRequest('/api/contact', {}));
    assert.equal(emptyRes.status, 400);
    const emptyBody = await emptyRes.json();
    assert.match(emptyBody.error, /required/i);

    // 2. Missing name
    const noNameRes = await contactPost(createJsonRequest('/api/contact', {
      email: 'alex@example.com',
      message: 'Need a website.',
    }));
    assert.equal(noNameRes.status, 400);

    // 3. Missing message
    const noMsgRes = await contactPost(createJsonRequest('/api/contact', {
      name: 'Alex Patel',
      email: 'alex@example.com',
    }));
    assert.equal(noMsgRes.status, 400);

    // 4. Missing both email and phone
    const noContactRes = await contactPost(createJsonRequest('/api/contact', {
      name: 'Alex Patel',
      message: 'Please build my site.',
    }));
    assert.equal(noContactRes.status, 400);
    const noContactBody = await noContactRes.json();
    assert.match(noContactBody.error, /email.*required/i);
  });

  await t.test('/api/leads rejects submissions with zero contact identifiers', async () => {
    const emptyLeadRes = await leadsPost(createJsonRequest('/api/leads', {}));
    assert.equal(emptyLeadRes.status, 400);
    const body = await emptyLeadRes.json();
    assert.match(body.error, /contact identifier/i);
  });

  await t.test('/api/health-check rejects null, empty string, and whitespace URLs', async () => {
    const nullRes = await healthCheckPost(createJsonRequest('/api/health-check', {}));
    assert.equal(nullRes.status, 400);

    const whitespaceRes = await healthCheckPost(createJsonRequest('/api/health-check', { url: '    ' }));
    assert.equal(whitespaceRes.status, 400);
  });

  await t.test('/api/chat rejects missing or empty messages array', async () => {
    const noMsgRes = await chatPost(createJsonRequest('/api/chat', {}));
    assert.equal(noMsgRes.status, 400);

    const emptyArrayRes = await chatPost(createJsonRequest('/api/chat', { messages: [] }));
    assert.equal(emptyArrayRes.status, 400);
  });
});
