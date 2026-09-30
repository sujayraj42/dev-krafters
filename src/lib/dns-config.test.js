const test = require('node:test');
const assert = require('node:assert');
const dns = require('dns');
const { configureDns } = require('./dns-config');

test('configureDns uses custom servers from DNS_SERVERS env var', () => {
  const originalEnv = process.env.DNS_SERVERS;
  let setServersCalledWith = null;
  const originalSetServers = dns.setServers;

  dns.setServers = (servers) => {
    setServersCalledWith = servers;
  };

  try {
    process.env.DNS_SERVERS = '1.1.1.1, 8.8.4.4';
    configureDns();
    assert.deepStrictEqual(setServersCalledWith, ['1.1.1.1', '8.8.4.4']);
  } finally {
    dns.setServers = originalSetServers;
    if (originalEnv !== undefined) {
      process.env.DNS_SERVERS = originalEnv;
    } else {
      delete process.env.DNS_SERVERS;
    }
  }
});

test('configureDns skips custom DNS when DNS_SERVERS is "off", "false", or "system"', () => {
  const originalEnv = process.env.DNS_SERVERS;
  let setServersCalled = false;
  const originalSetServers = dns.setServers;

  dns.setServers = () => {
    setServersCalled = true;
  };

  try {
    for (const flag of ['off', 'false', 'system', 'OFF', 'FALSE', 'SYSTEM']) {
      setServersCalled = false;
      process.env.DNS_SERVERS = flag;
      configureDns();
      assert.strictEqual(setServersCalled, false, `Expected setServers not to be called for ${flag}`);
    }
  } finally {
    dns.setServers = originalSetServers;
    if (originalEnv !== undefined) {
      process.env.DNS_SERVERS = originalEnv;
    } else {
      delete process.env.DNS_SERVERS;
    }
  }
});

test('configureDns handles errors gracefully when setServers throws', () => {
  const originalEnv = process.env.DNS_SERVERS;
  const originalSetServers = dns.setServers;

  dns.setServers = () => {
    throw new Error('Invalid DNS server format');
  };

  try {
    process.env.DNS_SERVERS = 'invalid-ip';
    assert.doesNotThrow(() => {
      configureDns();
    });
  } finally {
    dns.setServers = originalSetServers;
    if (originalEnv !== undefined) {
      process.env.DNS_SERVERS = originalEnv;
    } else {
      delete process.env.DNS_SERVERS;
    }
  }
});

test('configureDns fallback on win32 platform or non-production', () => {
  const originalEnv = process.env.DNS_SERVERS;
  const originalNodeEnv = process.env.NODE_ENV;
  let setServersCalledWith = null;
  const originalSetServers = dns.setServers;

  dns.setServers = (servers) => {
    setServersCalledWith = servers;
  };

  try {
    delete process.env.DNS_SERVERS;
    process.env.NODE_ENV = 'development';
    configureDns();
    assert.deepStrictEqual(setServersCalledWith, ['8.8.8.8', '1.1.1.1']);
  } finally {
    dns.setServers = originalSetServers;
    if (originalEnv !== undefined) {
      process.env.DNS_SERVERS = originalEnv;
    } else {
      delete process.env.DNS_SERVERS;
    }
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  }
});
