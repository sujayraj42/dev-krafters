// ═══════════════════════════════════════════════════════════════
// DEV KRAFTERS — Admin Authentication & Token Verification Module
// ═══════════════════════════════════════════════════════════════

import { DEFAULT_ADMIN_TOTP_SECRET } from './totp';

function getAuthSecret(): string {
  return process.env.ADMIN_TOTP_SECRET || process.env.ADMIN_PASSCODE || DEFAULT_ADMIN_TOTP_SECRET;
}

// Convert string to Uint8Array
function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Base64Url encoding/decoding
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
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

// Sign message bytes with HMAC-SHA256
async function hmacSha256(secret: string, dataStr: string): Promise<string> {
  const secretBytes = stringToBytes(secret);
  const dataBytes = stringToBytes(dataStr);

  const keyBuffer = secretBytes.buffer.slice(
    secretBytes.byteOffset,
    secretBytes.byteOffset + secretBytes.byteLength
  ) as ArrayBuffer;
  const msgBuffer = dataBytes.buffer.slice(
    dataBytes.byteOffset,
    dataBytes.byteOffset + dataBytes.byteLength
  ) as ArrayBuffer;

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgBuffer);
  return base64UrlEncode(new Uint8Array(signature));
}

export interface AdminTokenPayload {
  role: string;
  exp: number;
  iat: number;
}

/**
 * Generate a signed admin session token valid for 24 hours
 */
export async function createAdminToken(expiresInMs = 24 * 60 * 60 * 1000): Promise<string> {
  const secret = getAuthSecret();
  const now = Date.now();
  const payload: AdminTokenPayload = {
    role: 'admin',
    iat: now,
    exp: now + expiresInMs,
  };

  const payloadStr = base64UrlEncode(stringToBytes(JSON.stringify(payload)));
  const signature = await hmacSha256(secret, payloadStr);

  return `${payloadStr}.${signature}`;
}

/**
 * Verify signed admin session token
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadStr, signature] = parts;
  const secret = getAuthSecret();

  try {
    const expectedSignature = await hmacSha256(secret, payloadStr);
    if (signature !== expectedSignature) return false;

    const payloadBytes = base64UrlDecode(payloadStr);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload: AdminTokenPayload = JSON.parse(payloadJson);

    if (payload.role !== 'admin') return false;
    if (payload.exp && payload.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts and verifies admin authorization from HTTP Request headers or cookies
 */
export async function verifyAdminAuth(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  let token = '';

  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    token = request.headers.get('x-admin-token') || '';
  }

  // Fallback to cookie check if header is absent
  if (!token) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (!token) {
    return false;
  }

  // Verify signed token
  const isValidToken = await verifyAdminToken(token);
  if (isValidToken) {
    return true;
  }

  // Fallback check against raw ADMIN_PASSCODE if token isn't a signed token
  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (adminPasscode && adminPasscode.length >= 4 && token === adminPasscode) {
    return true;
  }

  return false;
}
