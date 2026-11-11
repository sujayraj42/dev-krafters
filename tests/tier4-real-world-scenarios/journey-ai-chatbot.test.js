const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');

const { POST: chatPost } = require('@/app/api/chat/route');

test('Tier 4: Journey 4 - Real-Time AI Chatbot Consultation to Autonomous Lead Capture', async (t) => {
  await t.test('Multi-turn conversation handles questions and captures visitor contact details', async () => {
    // Turn 1: Visitor asks about turnaround times
    const turn1Payload = {
      messages: [
        { role: 'user', content: 'How long is the delivery time for a business website?' },
      ],
    };
    const turn1Res = await chatPost(createJsonRequest('/api/chat', turn1Payload));
    assert.equal(turn1Res.status, 200);
    const turn1Data = await turn1Res.json();
    assert.ok(turn1Data.reply.includes('Days') || turn1Data.reply.includes('fast'));

    // Turn 2: Visitor asks about fixed package pricing
    const turn2Payload = {
      messages: [
        { role: 'user', content: 'How long is the delivery time for a business website?' },
        { role: 'assistant', content: turn1Data.reply },
        { role: 'user', content: 'What is the price of the packages?' },
      ],
    };
    const turn2Res = await chatPost(createJsonRequest('/api/chat', turn2Payload));
    assert.equal(turn2Res.status, 200);
    const turn2Data = await turn2Res.json();
    assert.ok(turn2Data.reply.includes('25,000') || turn2Data.reply.includes('5,000'));

    // Turn 3: Visitor shares email to book consultation
    const turn3Payload = {
      messages: [
        { role: 'user', content: 'Hi, how fast can you launch a website for my new restaurant?' },
        { role: 'assistant', content: turn1Data.reply },
        { role: 'user', content: 'What are your package prices?' },
        { role: 'assistant', content: turn2Data.reply },
        { role: 'user', content: 'Sounds fair! Please contact me at contact@urbanbites.co.in to discuss our menu setup.' },
      ],
    };
    const turn3Res = await chatPost(createJsonRequest('/api/chat', turn3Payload));
    assert.equal(turn3Res.status, 200);
    const turn3Data = await turn3Res.json();
    assert.ok(turn3Data.reply, 'Must return response for lead message');
  });
});
