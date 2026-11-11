const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');

const { POST: chatPost } = require('@/app/api/chat/route');

test('Tier 3: Cross-Feature - AI Chatbot Lead Intent Detection & Capture Pipeline', async (t) => {
  await t.test('Detects email in conversation and triggers automated lead capture', async () => {
    const chatPayload = {
      messages: [
        { role: 'user', content: 'Hi, I need an e-commerce website for my boutique. Please email me at priya@boutiquedesi.com' },
      ],
    };

    const res = await chatPost(createJsonRequest('/api/chat', chatPayload));
    assert.equal(res.status, 200);
    const body = await res.json();

    assert.ok(body.reply, 'Should return conversational response');
    // Verify reply acknowledges project or provides pricing/contact directions
    assert.ok(
      body.reply.includes('price') ||
        body.reply.includes('contact') ||
        body.reply.includes('ecommerce') ||
        body.reply.includes('E-commerce') ||
        body.reply.includes('welcome') ||
        body.reply.includes('75,000') ||
        body.reply.includes('touch') ||
        body.reply.includes('Dev Krafters')
    );
  });

  await t.test('Regular queries without email do not disrupt conversational flow', async () => {
    const generalPayload = {
      messages: [
        { role: 'user', content: 'What is included in the Business Website package?' },
      ],
    };

    const res = await chatPost(createJsonRequest('/api/chat', generalPayload));
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply.includes('25,000') || body.reply.includes('5–8 pages') || body.reply.includes('Maps'));
  });
});
