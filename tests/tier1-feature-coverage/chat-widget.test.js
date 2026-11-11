const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');
const { createJsonRequest } = require('../helpers/mock-request');

const { ChatWidget } = require('@/components/ChatWidget');
const { POST: chatHandler } = require('@/app/api/chat/route');

test('Tier 1: ChatWidget - AI Floating Assistant & Natural Language Q&A', async (t) => {
  await t.test('ChatWidget component renders floating button and initial greeting', () => {
    const html = renderComponent(ChatWidget);
    const inspector = inspectHtml(html);

    assert.ok(
      inspector.contains('Open AI Assistant') || inspector.contains('Chat') || inspector.contains('Ask me'),
      'Chat trigger or greeting present'
    );
  });

  await t.test('/api/chat validates payload and provides authoritative fallback answers', async () => {
    // 1. Missing messages returns 400
    const emptyReq = createJsonRequest('/api/chat', {});
    const emptyRes = await chatHandler(emptyReq);
    assert.equal(emptyRes.status, 400);

    // 2. Pricing query returns exact spec pricing
    const pricingReq = createJsonRequest('/api/chat', {
      messages: [{ role: 'user', content: 'How much does a business website cost?' }],
    });
    const pricingRes = await chatHandler(pricingReq);
    assert.equal(pricingRes.status, 200);
    const pricingBody = await pricingRes.json();
    assert.ok(pricingBody.reply, 'Should return a reply');
    assert.ok(pricingBody.reply.includes('25,000') || pricingBody.reply.includes('5,000'), 'Reply must cite accurate package pricing');

    // 3. Turnaround timeline query
    const timelineReq = createJsonRequest('/api/chat', {
      messages: [{ role: 'user', content: 'How many days for delivery?' }],
    });
    const timelineRes = await chatHandler(timelineReq);
    assert.equal(timelineRes.status, 200);
    const timelineBody = await timelineRes.json();
    assert.ok(timelineBody.reply.includes('10 Days') || timelineBody.reply.includes('3 Days'), 'Reply must cite turnaround timelines');

    // 4. Lead email capture intent
    const leadReq = createJsonRequest('/api/chat', {
      messages: [
        { role: 'user', content: 'I am interested in a clinic site. Please contact me at dr.smith@clinichealth.in' },
      ],
    });
    const leadRes = await chatHandler(leadReq);
    assert.equal(leadRes.status, 200);
    const leadBody = await leadRes.json();
    assert.ok(leadBody.reply, 'Should acknowledge lead query');
  });
});
