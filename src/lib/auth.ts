import { verifyTotpCode, DEFAULT_ADMIN_TOTP_SECRET } from '@/lib/totp';

export async function verifyAdminAuth(request: Request): Promise<boolean> {
  const adminPasscode = process.env.ADMIN_PASSCODE || '1234';
  const totpSecret = process.env.ADMIN_TOTP_SECRET || DEFAULT_ADMIN_TOTP_SECRET;

  // 1. Check x-admin-passcode header
  const headerPasscode = request.headers.get('x-admin-passcode');
  if (headerPasscode) {
    const cleanHeader = headerPasscode.trim();
    if (cleanHeader === adminPasscode) return true;
    if (await verifyTotpCode(cleanHeader, totpSecret)) return true;
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === adminPasscode) return true;
    if (await verifyTotpCode(token, totpSecret)) return true;
  }

  // 3. Check cookies if present
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    const cookieToken = cookies['admin_passcode'] || cookies['admin_token'];
    if (cookieToken) {
      const cleanCookie = cookieToken.trim();
      if (cleanCookie === adminPasscode) return true;
      if (await verifyTotpCode(cleanCookie, totpSecret)) return true;
    }
  }

  return false;
}
