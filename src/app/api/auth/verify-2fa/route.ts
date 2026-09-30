import { NextResponse } from 'next/server';
import { verifyTotpCode, DEFAULT_ADMIN_TOTP_SECRET, getAuthenticatorQrCodeUrl } from '@/lib/totp';

export const dynamic = 'force-dynamic';

// GET /api/auth/verify-2fa - Returns QR code URL & secret for setup
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : authHeader.trim();

  const secret = process.env.ADMIN_TOTP_SECRET || DEFAULT_ADMIN_TOTP_SECRET;
  const adminPasscode = process.env.ADMIN_PASSCODE || '1234';

  const isPasscodeValid = Boolean(token) && token === adminPasscode;

  const isTotpValid = Boolean(token) && (await verifyTotpCode(token, secret));

  if (!token || (!isPasscodeValid && !isTotpValid)) {
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

// POST /api/auth/verify-2fa - Verifies 6-digit Google Authenticator code or fallback PIN
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, pin } = body;

    const secret = process.env.ADMIN_TOTP_SECRET || DEFAULT_ADMIN_TOTP_SECRET;
    const adminPasscode = process.env.ADMIN_PASSCODE || '1234';

    // 1. Check fallback PIN / passcode if submitted
    if (pin && pin === adminPasscode) {
      return NextResponse.json({
        success: true,
        method: 'passcode',
        message: 'Unlocked via Passcode PIN',
      });
    }

    // 2. Check 6-digit Google Authenticator TOTP token
    if (code) {
      const isValidTotp = await verifyTotpCode(code, secret);
      if (isValidTotp) {
        return NextResponse.json({
          success: true,
          method: 'google_authenticator',
          message: 'Unlocked via Google Authenticator 2FA',
        });
      }
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
