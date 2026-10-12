import { NextResponse } from 'next/server';
import { verifyTotpCode, DEFAULT_ADMIN_TOTP_SECRET, getAuthenticatorQrCodeUrl } from '@/lib/totp';
import {
  createAdminSessionToken,
  isAuthenticatedAdmin,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/auth/verify-2fa - Returns QR code URL & secret for authenticated admins
export async function GET(request: Request) {
  const secret = process.env.ADMIN_TOTP_SECRET || DEFAULT_ADMIN_TOTP_SECRET;
  const adminPasscode = process.env.ADMIN_PASSCODE || '1234';

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : authHeader.trim();

  const isPasscodeValid = Boolean(token) && token === adminPasscode;
  const isTotpValid = Boolean(token) && (await verifyTotpCode(token, secret));
  const isSessionValid = await isAuthenticatedAdmin(request);

  if (!isPasscodeValid && !isTotpValid && !isSessionValid) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Valid passcode or TOTP token required.' },
      { status: 401 }
    );
  }

  const qrCodeUrl = getAuthenticatorQrCodeUrl(secret);

  return NextResponse.json({
    success: true,
    secret,
    qrCodeUrl,
    passcodeDefault: adminPasscode,
  });
}

// POST /api/auth/verify-2fa - Verifies 6-digit Google Authenticator code or secure PIN
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, pin } = body;

    const secret = process.env.ADMIN_TOTP_SECRET || DEFAULT_ADMIN_TOTP_SECRET;
    const adminPasscode = process.env.ADMIN_PASSCODE || '1234';

    let authenticated = false;
    let method = '';

    // 1. Check fallback PIN / passcode if submitted
    if (pin && typeof pin === 'string' && pin.trim() === adminPasscode) {
      authenticated = true;
      method = 'passcode';
    }

    // 2. Check 6-digit Google Authenticator TOTP token
    if (!authenticated && code && typeof code === 'string') {
      const isValidTotp = await verifyTotpCode(code, secret);
      if (isValidTotp) {
        authenticated = true;
        method = 'google_authenticator';
      }
    }

    if (authenticated) {
      const token = await createAdminSessionToken();
      const response = NextResponse.json({
        success: true,
        method,
        token,
        message: 'Admin session authenticated successfully',
      });

      // Set HTTP-only secure cookie for admin session
      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 hours
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid 6-digit Google Authenticator code or passcode PIN.',
      },
      { status: 401 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE /api/auth/verify-2fa - Logout / clear admin session cookie
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
