import assert from 'node:assert';
import { GET, PATCH, DELETE } from '../src/app/api/leads/route';
import { createAdminToken, verifyAdminToken } from '../src/lib/auth';

async function runSecurityTests() {
  console.log('🔒 Starting Security & Authentication Tests for /api/leads...\n');

  // Test 1: Unauthenticated GET /api/leads MUST return 401 Unauthorized
  {
    const req = new Request('http://localhost:3000/api/leads', { method: 'GET' });
    const res = await GET(req);
    const data = await res.json();
    assert.strictEqual(res.status, 401, 'Unauthenticated GET should return HTTP 401');
    assert.strictEqual(data.success, false, 'Response success field should be false');
    console.log('✓ PASS: Unauthenticated GET /api/leads rejected with 401 Unauthorized');
  }

  // Test 2: Unauthenticated PATCH /api/leads MUST return 401 Unauthorized
  {
    const req = new Request('http://localhost:3000/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'test_id', status: 'converted' }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    assert.strictEqual(res.status, 401, 'Unauthenticated PATCH should return HTTP 401');
    assert.strictEqual(data.success, false, 'Response success field should be false');
    console.log('✓ PASS: Unauthenticated PATCH /api/leads rejected with 401 Unauthorized');
  }

  // Test 3: Unauthenticated DELETE /api/leads MUST return 401 Unauthorized
  {
    const req = new Request('http://localhost:3000/api/leads', { method: 'DELETE' });
    const res = await DELETE(req);
    const data = await res.json();
    assert.strictEqual(res.status, 401, 'Unauthenticated DELETE should return HTTP 401');
    assert.strictEqual(data.success, false, 'Response success field should be false');
    console.log('✓ PASS: Unauthenticated DELETE /api/leads rejected with 401 Unauthorized');
  }

  // Test 4: Request with invalid/forged token MUST return 401 Unauthorized
  {
    const req = new Request('http://localhost:3000/api/leads', {
      method: 'GET',
      headers: { Authorization: 'Bearer forged.fake.token' },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 401, 'GET with forged token should return HTTP 401');
    console.log('✓ PASS: Request with forged token rejected with 401 Unauthorized');
  }

  // Test 5: Token Generation & Verification Unit Test
  {
    const validToken = await createAdminToken();
    const isValid = await verifyAdminToken(validToken);
    assert.strictEqual(isValid, true, 'createAdminToken should generate a valid token');

    const isTamperedValid = await verifyAdminToken(validToken + 'invalid');
    assert.strictEqual(isTamperedValid, false, 'Tampered token should be rejected');
    console.log('✓ PASS: createAdminToken & verifyAdminToken function correctly');
  }

  // Test 6: Authenticated GET /api/leads with valid token MUST NOT return 401
  {
    const validToken = await createAdminToken();
    const req = new Request('http://localhost:3000/api/leads', {
      method: 'GET',
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await GET(req);
    assert.notStrictEqual(res.status, 401, 'Authenticated GET should not be rejected with 401');
    console.log(`✓ PASS: Authenticated GET /api/leads passed auth check (HTTP status: ${res.status})`);
  }

  console.log('\n✅ ALL SECURITY TESTS PASSED SUCCESSFULLY!');
}

runSecurityTests().catch((err) => {
  console.error('❌ SECURITY TEST FAILED:', err);
  process.exit(1);
});
