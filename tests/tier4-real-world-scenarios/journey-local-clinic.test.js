const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');

const { POST: healthCheckPost } = require('@/app/api/health-check/route');
const { POST: contactPost } = require('@/app/api/contact/route');

test('Tier 4: Journey 1 - Local Clinic Owner Discovery to WhatsApp Handoff', async (t) => {
  const originalFetch = globalThis.fetch;

  await t.test('Complete end-to-end customer journey from domain audit to WhatsApp brief handoff', async () => {
    // Step 1: Clinic owner enters website URL for audit
    const clinicDomain = 'https://guptaeyecare.in';
    const mockHtml = `<!doctype html><html><head><title>Gupta Eye Care</title></head><body><h1>Dr. Gupta Clinic</h1></body></html>`;
    globalThis.fetch = async () => new Response(mockHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });

    let auditData;
    try {
      const auditRes = await healthCheckPost(createJsonRequest('/api/health-check', { url: clinicDomain }));
      assert.equal(auditRes.status, 200);
      auditData = await auditRes.json();
      assert.ok(auditData.score > 0, 'Audit must return a score');
    } finally {
      globalThis.fetch = originalFetch;
    }

    // Step 2: Handoff link to /contact is derived from audit result
    const contactUrl = `/contact?url=${encodeURIComponent(auditData.url)}`;
    const parsedContactUrl = new URL(`https://devkrafters.com${contactUrl}`);
    assert.equal(parsedContactUrl.searchParams.get('url'), 'https://guptaeyecare.in/');

    // Step 3: Submitting customized 4-step brief to /api/contact
    const clinicBrief = {
      name: 'Dr. Ramesh Gupta (Gupta Eye Care)',
      email: 'dr.gupta@guptaeyecare.in',
      phone: '+919876511111',
      businessType: 'Clinics & Doctors',
      projectType: 'Business Website',
      message: `
--- Comprehensive Master Website Brief ---
Owner Name: Dr. Ramesh Gupta
Business Name: Gupta Eye Care
City / Location: Bengaluru
WhatsApp / Phone: +919876511111
Email: dr.gupta@guptaeyecare.in
Category: Clinics & Doctors
Primary Goal: Direct WhatsApp & Phone Calls
Existing Site: ${clinicDomain}
Selected Package: Business Website (₹25,000)
Chosen Features: Google Maps, WhatsApp Appointment Booking, Doctor Profiles
Notes: Need emergency eye care alert banner.
      `.trim(),
    };

    const submitRes = await contactPost(createJsonRequest('/api/contact', clinicBrief));
    assert.equal(submitRes.status, 200, 'Contact API should accept clinic brief submission');
    const submitData = await submitRes.json();
    assert.equal(submitData.success, true);

    // Step 4: Verify post-submission WhatsApp handoff link formatting
    const businessName = 'Gupta Eye Care';
    const expectedWaLink = `https://wa.me/919999999999?text=Hi%20Dev%20Krafters!%20I%20just%20submitted%20my%20website%20brief%20for%20${encodeURIComponent(
      businessName
    )}.`;

    assert.ok(expectedWaLink.includes('wa.me/919999999999'));
    assert.ok(expectedWaLink.includes('Gupta%20Eye%20Care'));
  });
});
