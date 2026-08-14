import { GET, POST } from '../src/app/api/auth/verify-2fa/route';
import { generateTotpCode, DEFAULT_ADMIN_TOTP_SECRET } from '../src/lib/totp';
import assert from 'node:assert';

async function runTests() {
  console.log('Running 2FA Security & Verification Tests...');

  // 1. Test GET route does not expose passcodeDefault
  {
    const res = await GET();
    const data = await res.json();
    assert.strictEqual(data.success, true, 'GET route should succeed');
    assert.strictEqual(data.passcodeDefault, undefined, 'GET route must NOT expose passcodeDefault');
    assert.ok(data.secret, 'GET route should return secret');
    assert.ok(data.qrCodeUrl, 'GET route should return qrCodeUrl');
    console.log('✔ Test 1 passed: GET route does not leak passcodeDefault');
  }

  // 2. Test hardcoded bypass strings ('1234', 'admin', 'devkrafters') are rejected when ADMIN_PASSCODE is unset
  {
    delete process.env.ADMIN_PASSCODE;

    for (const bypassPin of ['1234', 'admin', 'devkrafters', '0000']) {
      const req = new Request('http://localhost/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: bypassPin }),
      });
      const res = await POST(req);
      const data = await res.json();
      assert.strictEqual(res.status, 401, `Status should be 401 for bypass PIN "${bypassPin}"`);
      assert.strictEqual(data.success, false, `Authentication should fail for bypass PIN "${bypassPin}"`);
    }
    console.log('✔ Test 2 passed: Hardcoded bypass PINs are rejected when ADMIN_PASSCODE is unset');
  }

  // 3. Test hardcoded bypass strings are rejected when ADMIN_PASSCODE is set to a secret value
  {
    process.env.ADMIN_PASSCODE = 'super-secret-admin-passcode-9876';

    for (const bypassPin of ['1234', 'admin', 'devkrafters']) {
      const req = new Request('http://localhost/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: bypassPin }),
      });
      const res = await POST(req);
      const data = await res.json();
      assert.strictEqual(res.status, 401, `Status should be 401 for bypass PIN "${bypassPin}"`);
      assert.strictEqual(data.success, false, `Authentication should fail for bypass PIN "${bypassPin}"`);
    }

    // Correct ADMIN_PASSCODE should succeed
    const reqCorrect = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: 'super-secret-admin-passcode-9876' }),
    });
    const resCorrect = await POST(reqCorrect);
    const dataCorrect = await resCorrect.json();
    assert.strictEqual(resCorrect.status, 200, 'Status should be 200 for correct ADMIN_PASSCODE');
    assert.strictEqual(dataCorrect.success, true, 'Authentication should succeed for correct ADMIN_PASSCODE');
    assert.strictEqual(dataCorrect.method, 'passcode', 'Method should be passcode');

    delete process.env.ADMIN_PASSCODE;
    console.log('✔ Test 3 passed: ADMIN_PASSCODE environment variable works and bypass PINs fail');
  }

  // 4. Test valid TOTP code authentication
  {
    const totpCode = await generateTotpCode(DEFAULT_ADMIN_TOTP_SECRET);
    const req = new Request('http://localhost/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: totpCode }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200, 'Status should be 200 for valid TOTP');
    assert.strictEqual(data.success, true, 'Authentication should succeed for valid TOTP');
    assert.strictEqual(data.method, 'google_authenticator', 'Method should be google_authenticator');
    console.log('✔ Test 4 passed: Valid TOTP code authenticates successfully');
  }

  console.log('All 2FA Security Tests Passed Successfully!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
