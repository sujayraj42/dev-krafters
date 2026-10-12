/**
 * Admin Authentication & Session Management
 * Lightweight, zero-dependency signed session tokens using Web Crypto API.
 */

export const ADMIN_COOKIE_NAME = 'devkrafters_admin_session';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_TOTP_SECRET ||
    'devkrafters-super-secret-fallback-key-2026'
  );
}

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyData = enc.encode(getSecretKey());
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a signed admin session token.
 */
export async function createAdminSessionToken(): Promise<string> {
  const payload = {
    role: 'admin',
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const payloadStr = JSON.stringify(payload);
  const enc = new TextEncoder();
  const payloadBytes = enc.encode(payloadStr);
  const payloadB64 = toBase64Url(payloadBytes.buffer as ArrayBuffer);

  const key = await getCryptoKey();
  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(payloadB64) as unknown as BufferSource
  );
  const sigB64 = toBase64Url(sigBuffer);

  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies a signed session token.
 */
export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  try {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [payloadB64, sigB64] = parts;
    const enc = new TextEncoder();

    const key = await getCryptoKey();
    const sigBytes = fromBase64Url(sigB64);
    const isValidSig = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(payloadB64) as unknown as BufferSource
    );

    if (!isValidSig) return false;

    const payloadBytes = fromBase64Url(payloadB64);
    const dec = new TextDecoder();
    const payload = JSON.parse(dec.decode(payloadBytes));

    if (payload.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return false; // Token expired
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether an incoming Next.js Request has a valid admin session
 * (via HTTP cookie or Authorization header).
 */
export async function isAuthenticatedAdmin(request: Request): Promise<boolean> {
  // 1. Check Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    if (await verifyAdminSessionToken(bearerToken)) {
      return true;
    }
  }

  // 2. Check Cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${ADMIN_COOKIE_NAME}=`)) {
      const token = c.substring(ADMIN_COOKIE_NAME.length + 1);
      if (await verifyAdminSessionToken(token)) {
        return true;
      }
    }
  }

  return false;
}
