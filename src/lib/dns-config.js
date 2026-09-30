const dns = require('dns');

/**
 * Configures DNS servers for MongoDB Atlas SRV record resolution.
 *
 * Behavior:
 * - If process.env.DNS_SERVERS is set to 'off', 'false', or 'system', custom DNS configuration is skipped.
 * - If process.env.DNS_SERVERS contains a comma-separated list of IP addresses (e.g. '8.8.8.8,1.1.1.1'),
 *   those specific servers are used.
 * - If process.env.DNS_SERVERS is unset:
 *   - On Windows (process.platform === 'win32') or non-production environments, sets fallback DNS
 *     servers ['8.8.8.8', '1.1.1.1'] inside a try-catch block to prevent Windows DNS SRV lookup failures.
 */
function configureDns() {
  const envDns = process.env.DNS_SERVERS;

  if (envDns) {
    const normalized = envDns.trim().toLowerCase();
    if (normalized === 'off' || normalized === 'false' || normalized === 'system') {
      return;
    }

    const customServers = envDns
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (customServers.length > 0) {
      try {
        dns.setServers(customServers);
      } catch (err) {
        console.warn('[DNS Config] Failed to set custom DNS servers:', err instanceof Error ? err.message : err);
      }
      return;
    }
  }

  // Default fallback: apply DNS workaround for Windows or local non-prod environments
  if (process.platform === 'win32' || process.env.NODE_ENV !== 'production') {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch {
      // Ignore in environments where custom DNS servers cannot be set
    }
  }
}

module.exports = { configureDns };
module.exports.configureDns = configureDns;
module.exports.default = configureDns;
