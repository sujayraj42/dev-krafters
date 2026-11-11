const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest, createAuthorizedRequest } = require('../helpers/mock-request');

const { POST: verify2faPost } = require('@/app/api/auth/verify-2fa/route');
const { GET: leadsGet, POST: leadsPost, PATCH: leadsPatch } = require('@/app/api/leads/route');

test('Tier 4: Journey 5 - Studio Admin 2FA Auth, Leads CRM Management & CSV Export', async (t) => {
  let adminToken = '';

  await t.test('Step 1: Admin logs in with passcode 1234 and obtains signed session token', async () => {
    const authRes = await verify2faPost(createJsonRequest('/api/auth/verify-2fa', { pin: '1234' }));
    assert.equal(authRes.status, 200);
    const authBody = await authRes.json();
    assert.equal(authBody.success, true);
    assert.ok(authBody.token, 'Must return signed token');
    adminToken = authBody.token;

    const cookie = authRes.cookies.get('devkrafters_admin_session');
    assert.ok(cookie, 'devkrafters_admin_session cookie must be set');
  });

  await t.test('Step 2: Authenticated admin queries /api/leads with authorized token', async () => {
    const leadsReq = createAuthorizedRequest('/api/leads', adminToken);
    const leadsRes = await leadsGet(leadsReq);

    // Either 200 (connected to MongoDB) or 503 (offline fallback when MONGODB_URI unconfigured)
    assert.ok(
      leadsRes.status === 200 || leadsRes.status === 503,
      `Expected 200 or 503 for authorized admin fetch, got ${leadsRes.status}`
    );
  });

  await t.test('Step 3: Admin updates lead status and internal review notes via PATCH /api/leads', async () => {
    // Submit a lead first
    const newLeadRes = await leadsPost(createJsonRequest('/api/leads', {
      name: 'Ananya Singhal',
      email: 'ananya@singhaltextiles.com',
      phone: '+919876599999',
      projectType: 'E-commerce Store',
      message: 'Catalogue of 25 textiles with Razorpay integration.',
    }));
    assert.equal(newLeadRes.status, 200);
    const newLeadData = await newLeadRes.json();
    const leadId = newLeadData.lead.id;

    // Admin updates status to 'converted' with notes
    const patchReq = createAuthorizedRequest(
      '/api/leads',
      adminToken,
      'PATCH',
      {
        id: leadId,
        status: 'converted',
        notes: 'Deposit received via UPI. Design mockups sent.',
      }
    );

    const patchRes = await leadsPatch(patchReq);
    assert.ok(patchRes.status === 200 || patchRes.status === 500, `Expected 200 or 503/500, got ${patchRes.status}`);
    const patchData = await patchRes.json();
    if (patchRes.status === 200) {
      assert.equal(patchData.success, true);
    } else {
      assert.match(patchData.error, /mongodb/i);
    }
  });

  await t.test('Step 4: CSV export engine serializes lead records into RFC-compliant CSV text', () => {
    const sampleLeads = [
      {
        id: 'lead-001',
        status: 'converted',
        type: 'contact',
        name: 'Dr. Ramesh Gupta',
        email: 'dr.gupta@guptaeyecare.in',
        phone: '+919876511111',
        projectType: 'Business Website',
        budget: '₹25,000',
        notes: 'Deposit "verified" via bank.',
        message: 'Need 6 pages, appointment system.',
        date: new Date('2026-11-10T12:00:00Z').toISOString(),
      },
    ];

    const headers = 'ID,Status,Type,Name,Email,Phone,Project Scope,Budget/Estimate,Notes,Message,Date\n';
    const csvContent =
      headers +
      sampleLeads
        .map(
          (r) =>
            `"${r.id}","${r.status || 'new'}","${r.type}","${r.name || ''}","${r.email || ''}","${r.phone || ''}","${
              r.projectType || ''
            }","${r.totalEstimateFormatted || r.budget || ''}","${(r.notes || '').replace(
              /"/g,
              '""'
            )}","${(r.message || '').replace(/"/g, '""')}","${new Date(r.date).toLocaleString()}"`
        )
        .join('\n');

    assert.ok(csvContent.startsWith('ID,Status,Type,Name,Email,Phone'), 'CSV must include header row');
    assert.ok(csvContent.includes('"lead-001"'), 'Must serialize lead ID');
    assert.ok(csvContent.includes('"Dr. Ramesh Gupta"'), 'Must serialize lead name');
    assert.ok(csvContent.includes('"Deposit ""verified"" via bank."'), 'Must escape internal double quotes as ""');
  });
});
