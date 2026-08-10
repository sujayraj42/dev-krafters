// ═══════════════════════════════════════════════════════════════
// DEV KRAFTERS — Google Authenticator TOTP Security Module
// ═══════════════════════════════════════════════════════════════
// Native HMAC-SHA1 Time-based One-Time Password (TOTP) verification
// Works in both Node.js & Serverless edge runtimes without external dependencies.

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Decode Base32 string to Uint8Array bytes
function base32ToBytes(base32: string): Uint8Array {
  const cleaned = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const bits: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) continue;
    for (let b = 4; b >= 0; b--) {
      bits.push((val >> b) & 1);
    }
  }

  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    let byteVal = 0;
    for (let b = 0; b < 8; b++) {
      byteVal = (byteVal << 1) | bits[i * 8 + b];
    }
    bytes[i] = byteVal;
  }

  return bytes;
}

// HMAC-SHA1 Implementation using Web Crypto API
async function hmacSha1(keyBytes: Uint8Array, messageBytes: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);
  return new Uint8Array(signature);
}

// Generate 6-digit TOTP code for a time step
export async function generateTotpCode(secret: string, timeStepWindow: number = 0): Promise<string> {
  const secretBytes = base32ToBytes(secret);
  const timeStep = Math.floor(Date.now() / 1000 / 30) + timeStepWindow;

  // Convert timeStep into 8-byte big-endian buffer
  const msgBytes = new Uint8Array(8);
  let temp = timeStep;
  for (let i = 7; i >= 0; i--) {
    msgBytes[i] = temp & 0xff;
    temp = Math.floor(temp / 256);
  }

  const hmacResult = await hmacSha1(secretBytes, msgBytes);
  const offset = hmacResult[hmacResult.length - 1] & 0xf;

  const binaryCode =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  const otp = (binaryCode % 1000000).toString().padStart(6, '0');
  return otp;
}

// Verify TOTP code against secret (+/- 1 time step window for clock drift tolerance)
export async function verifyTotpCode(token: string, secret: string): Promise<boolean> {
  const cleanToken = token.trim().replace(/\s+/g, '');
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) {
    return false;
  }

  // Check current, previous (t-30s), and next (t+30s) windows
  for (const window of [0, -1, 1]) {
    const expected = await generateTotpCode(secret, window);
    if (cleanToken === expected) {
      return true;
    }
  }

  return false;
}

// Get Google Authenticator QR Code Image URL
export function getAuthenticatorQrCodeUrl(
  secret: string,
  accountName: string = 'admin@devkrafters.com',
  issuer: string = 'Dev Krafters'
): string {
  const totpUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(totpUri)}`;
}

// Default TOTP secret key for Dev Krafters Admin (Can be overridden via ADMIN_TOTP_SECRET env var)
export const DEFAULT_ADMIN_TOTP_SECRET = process.env.ADMIN_TOTP_SECRET || 'DEVKRAFTERS2FASECRET32';
