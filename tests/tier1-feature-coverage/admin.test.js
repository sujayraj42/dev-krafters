const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');
const { createJsonRequest, createGetRequest, createAuthorizedRequest } = require('../helpers/mock-request');

const AdminPage = require('@/app/admin/page').default;
const { GET: verify2faGet, POST: verify2faPost } = require('@/app/api/auth/verify-2fa/route');
const { GET: leadsGet, POST: leadsPost, PATCH: leadsPatch, DELETE: leadsDelete } = require('@/app/api/leads/route');

test('Tier 1: Admin - 2FA Authentication Gate & Leads Management', async (t) => {
  await t.test('Admin UI renders 2FA gate when unauthenticated', () => {
    const html = renderComponent(AdminPage);
    const inspector = inspectHtml(html);

    assert.ok(
      inspector.contains('Studio Admin') || inspector.contains('Authentication') || inspector.contains('Security'),
      'Admin page should render security/auth gate headline'
    );
    assert.ok(
      inspector.contains('Google Authenticator') || inspector.contains('Passcode') || inspector.contains('PIN'),
      'Admin page should offer 2FA verification options'
    );
  });

  await t.test('/api/auth/verify-2fa rejects unauthorized requests and accepts valid PIN', async () => {
    // 1. GET without authorization header
    const unauthGetReq = createGetRequest('/api/auth/verify-2fa');
    const getRes = await verify2faGet(unauthGetReq);
    assert.equal(getRes.status, 401, 'Unauthenticated GET to /api/auth/verify-2fa must return 401');

    // 2. GET with valid Bearer passcode (ADMIN_PASSCODE is '1234')
    const authGetReq = createAuthorizedRequest('/api/auth/verify-2fa', '1234');
    const authGetRes = await verify2faGet(authGetReq);
    assert.equal(authGetRes.status, 200, 'Authorized GET should return 200');
    const getBody = await authGetRes.json();
    assert.equal(getBody.success, true);
    assert.ok(getBody.secret, 'Must provide TOTP secret');
    assert.ok(getBody.qrCodeUrl, 'Must provide QR code URL');

    // 3. POST with invalid PIN
    const invalidPostReq = createJsonRequest('/api/auth/verify-2fa', { pin: 'wrong-pin' });
    const invalidPostRes = await verify2faPost(invalidPostReq);
    assert.equal(invalidPostRes.status, 401, 'Invalid PIN must return 401');

    // 4. POST with valid PIN
    const validPostReq = createJsonRequest('/api/auth/verify-2fa', { pin: '1234' });
    const validPostRes = await verify2faPost(validPostReq);
    assert.equal(validPostRes.status, 200, 'Valid PIN must return 200');
    const validBody = await validPostRes.json();
    assert.equal(validBody.success, true);
    assert.equal(validBody.method, 'passcode');
    assert.ok(validBody.token, 'Must return admin session token');

    // Verify session cookie was set
    const setCookie = validPostRes.cookies.get('devkrafters_admin_session');
    assert.ok(setCookie, 'devkrafters_admin_session cookie must be set on successful authentication');
    assert.equal(setCookie.value, validBody.token);
  });

  await t.test('/api/leads enforces authorization and validates public submissions', async () => {
    // 1. GET without admin credentials returns 401
    const unauthGetReq = createGetRequest('/api/leads');
    const getRes = await leadsGet(unauthGetReq);
    assert.equal(getRes.status, 401, 'Unauthorized GET /api/leads must return 401');

    // 2. POST with missing contact data returns 400
    const emptyPostReq = createJsonRequest('/api/leads', { type: 'contact' });
    const emptyPostRes = await leadsPost(emptyPostReq);
    assert.equal(emptyPostRes.status, 400, 'Empty submission must return 400');

    // 3. POST with invalid email returns 400
    const badEmailReq = createJsonRequest('/api/leads', {
      name: 'John Doe',
      email: 'not-an-email',
      phone: '+919876543210',
    });
    const badEmailRes = await leadsPost(badEmailReq);
    assert.equal(badEmailRes.status, 400, 'Invalid email submission must return 400');

    // 4. POST with valid lead returns 200
    const validPostReq = createJsonRequest('/api/leads', {
      name: 'Dr. Anita Roy',
      email: 'anita@royclinic.com',
      phone: '+919876543210',
      projectType: 'Clinic Website',
      message: 'Looking for appointment booking integration.',
    });
    const validPostRes = await leadsPost(validPostReq);
    assert.equal(validPostRes.status, 200, 'Valid lead submission must return 200');
    const validBody = await validPostRes.json();
    assert.equal(validBody.success, true);
    assert.ok(validBody.lead, 'Must return persisted or ephemeral lead record');

    // 5. PATCH without admin credentials returns 401
    const patchReq = createJsonRequest('/api/leads', { id: 'test-id', status: 'converted' }, { method: 'PATCH' });
    const patchRes = await leadsPatch(patchReq);
    assert.equal(patchRes.status, 401, 'Unauthorized PATCH /api/leads must return 401');

    // 6. DELETE without admin credentials returns 401
    const deleteReq = createJsonRequest('/api/leads', {}, { method: 'DELETE' });
    const deleteRes = await leadsDelete(deleteReq);
    assert.equal(deleteRes.status, 401, 'Unauthorized DELETE /api/leads must return 401');
  });
});
