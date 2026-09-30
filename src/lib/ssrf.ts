import dns from 'dns';
import net from 'net';

/**
 * Converts IPv4 string to 32-bit unsigned integer.
 */
function ipv4ToLong(ip: string): number {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

/**
 * Checks if a standard IPv4 address (x.x.x.x) is in a private/reserved/internal IP range.
 */
export function isPrivateIPv4(ip: string): boolean {
  if (!net.isIPv4(ip)) return false;

  const num = ipv4ToLong(ip);

  // 0.0.0.0/8 (Current network / default)
  if ((num & 0xff000000) >>> 0 === 0x00000000) return true;
  // 10.0.0.0/8 (Private network)
  if ((num & 0xff000000) >>> 0 === 0x0a000000) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if ((num & 0xffc00000) >>> 0 === (((100 << 24) | (64 << 16)) >>> 0)) return true;
  // 127.0.0.0/8 (Loopback)
  if ((num & 0xff000000) >>> 0 === 0x7f000000) return true;
  // 169.254.0.0/16 (Link-local / Cloud metadata service e.g. 169.254.169.254)
  if ((num & 0xffff0000) >>> 0 === (((169 << 24) | (254 << 16)) >>> 0)) return true;
  // 172.16.0.0/12 (Private network)
  if ((num & 0xfff00000) >>> 0 === (((172 << 24) | (16 << 16)) >>> 0)) return true;
  // 192.0.0.0/24 (IETF Protocol Assignments)
  if ((num & 0xffffff00) >>> 0 === ((192 << 24) >>> 0)) return true;
  // 192.0.2.0/24 (TEST-NET-1)
  if ((num & 0xffffff00) >>> 0 === (((192 << 24) | (2 << 8)) >>> 0)) return true;
  // 192.88.99.0/24 (6to4 Relay Anycast)
  if ((num & 0xffffff00) >>> 0 === (((192 << 24) | (88 << 16) | (99 << 8)) >>> 0)) return true;
  // 192.168.0.0/16 (Private network)
  if ((num & 0xffff0000) >>> 0 === (((192 << 24) | (168 << 16)) >>> 0)) return true;
  // 198.18.0.0/15 (Benchmarking)
  if ((num & 0xfffe0000) >>> 0 === (((198 << 24) | (18 << 16)) >>> 0)) return true;
  // 198.51.100.0/24 (TEST-NET-2)
  if ((num & 0xffffff00) >>> 0 === (((198 << 24) | (51 << 16) | (100 << 8)) >>> 0)) return true;
  // 203.0.113.0/24 (TEST-NET-3)
  if ((num & 0xffffff00) >>> 0 === (((203 << 24) | (113 << 8)) >>> 0)) return true;
  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if ((num & 0xf0000000) >>> 0 === 0xe0000000 || (num & 0xf0000000) >>> 0 === 0xf0000000) return true;
  // 255.255.255.255/32 (Broadcast)
  if (num === 0xffffffff) return true;

  return false;
}

/**
 * Checks if an IPv6 address is in a private/reserved/internal IP range.
 */
export function isPrivateIPv6(ip: string): boolean {
  if (!net.isIPv6(ip)) return false;

  const normalized = ip.toLowerCase();

  // IPv4-mapped IPv6 address (::ffff:x.x.x.x or ::ffff:7f00:1)
  if (normalized.includes('::ffff:')) {
    const parts = normalized.split('::ffff:');
    const ipv4Part = parts[1];
    if (net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
    // Handle hex representation like ::ffff:7f00:1
    const hexParts = ipv4Part.split(':');
    if (hexParts.length === 2) {
      const high = parseInt(hexParts[0], 16);
      const low = parseInt(hexParts[1], 16);
      if (!isNaN(high) && !isNaN(low)) {
        const reconstructedIpv4 = `${(high >> 8) & 0xff}.${high & 0xff}.${(low >> 8) & 0xff}.${low & 0xff}`;
        return isPrivateIPv4(reconstructedIpv4);
      }
    }
  }

  // IPv4-compatible IPv6 (::x.x.x.x)
  if (normalized.startsWith('::') && normalized.includes('.')) {
    const ipv4Part = normalized.substring(2);
    if (net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
  }

  // Loopback ::1 / Unspecified ::
  if (normalized === '::1' || normalized === '::' || normalized === '0:0:0:0:0:0:0:1' || normalized === '0:0:0:0:0:0:0:0') {
    return true;
  }

  // Unique Local Address (fc00::/7 -> fc00:: to fdff::)
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) {
    return true;
  }

  // Link-Local Address (fe80::/10 -> fe80:: to febf::)
  if (/^fe[89ab]/i.test(normalized)) {
    return true;
  }

  // Site-Local Address (fec0::/10 -> fec0:: to feff::)
  if (/^fe[c-f]/i.test(normalized)) {
    return true;
  }

  // Multicast (ff00::/8)
  if (normalized.startsWith('ff')) {
    return true;
  }

  // Documentation (2001:db8::/32)
  if (normalized.startsWith('2001:db8:') || normalized.startsWith('2001:0db8:')) {
    return true;
  }

  // 6to4 Prefix (2002::/16) - Embedded IPv4 at bits 16-47
  if (normalized.startsWith('2002:')) {
    const parts = normalized.split(':');
    if (parts.length >= 3) {
      const p1 = parseInt(parts[1], 16);
      const p2 = parseInt(parts[2], 16);
      if (!isNaN(p1) && !isNaN(p2)) {
        const embeddedIpv4 = `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
        if (isPrivateIPv4(embeddedIpv4)) return true;
      }
    }
  }

  return false;
}

/**
 * Checks if an IP string (v4 or v6) is private or reserved.
 */
export function isPrivateIP(ip: string): boolean {
  // Strip bracket wrappers from IPv6 if present
  const cleanIp = ip.startsWith('[') && ip.endsWith(']') ? ip.slice(1, -1) : ip;

  if (net.isIPv4(cleanIp)) {
    return isPrivateIPv4(cleanIp);
  }
  if (net.isIPv6(cleanIp)) {
    return isPrivateIPv6(cleanIp);
  }

  return false;
}

/**
 * Checks if a hostname matches private domain naming conventions or formats.
 */
export function isPrivateHostname(hostname: string): boolean {
  const lowerHost = hostname.toLowerCase();

  if (lowerHost === 'localhost' || lowerHost.endsWith('.localhost')) return true;
  if (lowerHost.endsWith('.local') || lowerHost.endsWith('.internal') || lowerHost.endsWith('.lan') || lowerHost.endsWith('.home.arpa')) return true;

  // Direct IP literal checks
  if (isPrivateIP(lowerHost)) return true;

  return false;
}

export interface SSRFValidationResult {
  valid: boolean;
  reason?: string;
  resolvedIps?: string[];
}

/**
 * Validates a target URL to ensure it does not resolve to private or internal addresses.
 */
export async function validateUrlForSSRF(targetUrlStr: string): Promise<SSRFValidationResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrlStr);
  } catch {
    return { valid: false, reason: 'Invalid URL format' };
  }

  // Only allow http: and https: protocols
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { valid: false, reason: `Forbidden URL scheme: ${parsedUrl.protocol}` };
  }

  const hostname = parsedUrl.hostname;

  // Check hostname string patterns
  if (isPrivateHostname(hostname)) {
    return { valid: false, reason: `Access to local/internal host '${hostname}' is denied.` };
  }

  // Resolve hostname via DNS to verify all destination IPs
  try {
    const addresses = await dns.promises.lookup(hostname, { all: true });

    if (!addresses || addresses.length === 0) {
      return { valid: false, reason: `Could not resolve hostname '${hostname}'.` };
    }

    const resolvedIps = addresses.map((addr) => addr.address);

    for (const ip of resolvedIps) {
      if (isPrivateIP(ip)) {
        return { valid: false, reason: `Hostname '${hostname}' resolves to private IP range (${ip}).` };
      }
    }

    return { valid: true, resolvedIps };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'DNS lookup failed';
    return { valid: false, reason: `DNS lookup failed for '${hostname}': ${message}` };
  }
}
