import dns from 'node:dns/promises';
import net from 'node:net';

/**
 * Checks if an IPv4 address is in private/reserved ranges.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Treat malformed IPv4 string as unsafe
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 10.0.0.0/8 (Private network)
  if (a === 10) return true;

  // 100.64.0.0/10 (Shared address space / Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 169.254.0.0/16 (Link-local / Cloud Instance Metadata Services)
  if (a === 169 && b === 254) return true;

  // 172.16.0.0/12 (Private network)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (a === 192 && b === 0) return true;

  // 192.0.2.0/24 (TEST-NET-1)
  if (a === 192 && b === 0 && parts[2] === 2) return true;

  // 192.88.99.0/24 (6to4 Relay Anycast)
  if (a === 192 && b === 88 && parts[2] === 99) return true;

  // 192.168.0.0/16 (Private network)
  if (a === 192 && b === 168) return true;

  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;

  // 198.51.100.0/24 (TEST-NET-2)
  if (a === 198 && b === 51 && parts[2] === 100) return true;

  // 203.0.113.0/24 (TEST-NET-3)
  if (a === 203 && b === 0 && parts[2] === 113) return true;

  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved / Future use / Broadcast 255.255.255.255)
  if (a >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address is in private/reserved ranges.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  // Loopback (::1)
  if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1') return true;

  // Unspecified (::)
  if (normalized === '::' || normalized === '0:0:0:0:0:0:0:0') return true;

  // Unique Local Address (fc00::/7)
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;

  // Link-Local (fe80::/10)
  if (/^fe[89ab]/i.test(normalized)) return true;

  // IPv4-mapped IPv6 address (::ffff:x.x.x.x or ::ffff:7f00:1, etc.)
  if (normalized.startsWith('::ffff:')) {
    const ipv4Part = normalized.substring(7);
    if (net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
    // Handle hex notation inside ::ffff: (e.g., ::ffff:7f00:1)
    const hexParts = ipv4Part.split(':');
    if (hexParts.length === 2) {
      const p1 = parseInt(hexParts[0], 16);
      const p2 = parseInt(hexParts[1], 16);
      if (!isNaN(p1) && !isNaN(p2)) {
        const ipv4Str = `${(p1 >> 8) & 0xff}.${p1 & 0xff}.${(p2 >> 8) & 0xff}.${p2 & 0xff}`;
        return isPrivateIPv4(ipv4Str);
      }
    }
    return true; // Unparseable ::ffff: address -> reject
  }

  // IPv4-compatible IPv6 (deprecated, ::x.x.x.x)
  if (normalized.startsWith('::') && !normalized.includes(':', 2)) {
    const ipv4Part = normalized.substring(2);
    if (net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
  }

  // Multicast (ff00::/8)
  if (normalized.startsWith('ff')) return true;

  // Discard prefix (100::/64)
  if (normalized.startsWith('100:')) return true;

  return false;
}

/**
 * Validates whether an IP address string is safe (i.e. not in private/reserved/loopback ranges).
 */
export function isSafeIpAddress(ip: string): boolean {
  if (net.isIPv4(ip)) {
    return !isPrivateIPv4(ip);
  }
  if (net.isIPv6(ip)) {
    return !isPrivateIPv6(ip);
  }
  return false;
}

/**
 * Validates a target URL against SSRF attacks by checking the scheme, host, and resolving DNS.
 * Returns null if valid and safe, or an error message string if invalid or dangerous.
 */
export async function validateUrlForSsrf(targetUrlStr: string): Promise<string | null> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrlStr);
  } catch {
    return 'Invalid URL format.';
  }

  // Only allow HTTP and HTTPS
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return 'Only HTTP and HTTPS protocols are allowed.';
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Strip brackets from IPv6 hostnames like [::1]
  const cleanHostname = hostname.startsWith('[') && hostname.endsWith(']')
    ? hostname.slice(1, -1)
    : hostname;

  // Block obvious internal hostname patterns
  if (
    cleanHostname === 'localhost' ||
    cleanHostname.endsWith('.localhost') ||
    cleanHostname.endsWith('.local') ||
    cleanHostname.endsWith('.internal') ||
    cleanHostname.endsWith('.lan') ||
    cleanHostname.endsWith('.home.arpa')
  ) {
    return 'Requests to local or internal domain names are not allowed.';
  }

  // Check if hostname is directly an IP address
  if (net.isIP(cleanHostname)) {
    if (!isSafeIpAddress(cleanHostname)) {
      return 'Requests to private, loopback, or internal IP addresses are not allowed.';
    }
  }

  // Resolve hostname via DNS to verify resolved IP addresses
  try {
    const addresses = await dns.lookup(cleanHostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return 'Could not resolve domain name.';
    }

    for (const record of addresses) {
      if (!isSafeIpAddress(record.address)) {
        return 'Domain resolves to a private, loopback, or internal IP address.';
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'DNS lookup failed';
    return `Could not resolve domain name: ${message}`;
  }

  return null;
}
