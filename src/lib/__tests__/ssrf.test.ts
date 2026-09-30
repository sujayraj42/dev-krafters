import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isPrivateIPv4,
  isPrivateIPv6,
  isPrivateIP,
  isPrivateHostname,
  validateUrlForSSRF,
} from '../ssrf.js';

test('isPrivateIPv4 correctly identifies private and public IPv4 addresses', () => {
  // Loopback
  assert.equal(isPrivateIPv4('127.0.0.1'), true);
  assert.equal(isPrivateIPv4('127.0.0.254'), true);

  // Private RFC1918
  assert.equal(isPrivateIPv4('10.0.0.1'), true);
  assert.equal(isPrivateIPv4('10.255.255.254'), true);
  assert.equal(isPrivateIPv4('172.16.0.1'), true);
  assert.equal(isPrivateIPv4('172.31.255.254'), true);
  assert.equal(isPrivateIPv4('192.168.1.1'), true);
  assert.equal(isPrivateIPv4('192.168.255.254'), true);

  // Link Local / Metadata
  assert.equal(isPrivateIPv4('169.254.169.254'), true);

  // CGNAT / Reserved / Multicast
  assert.equal(isPrivateIPv4('100.64.0.1'), true);
  assert.equal(isPrivateIPv4('0.0.0.0'), true);
  assert.equal(isPrivateIPv4('224.0.0.1'), true);
  assert.equal(isPrivateIPv4('255.255.255.255'), true);

  // Public IPv4 addresses
  assert.equal(isPrivateIPv4('8.8.8.8'), false);
  assert.equal(isPrivateIPv4('1.1.1.1'), false);
  assert.equal(isPrivateIPv4('93.184.216.34'), false);
  assert.equal(isPrivateIPv4('172.32.0.1'), false);
});

test('isPrivateIPv6 correctly identifies private and public IPv6 addresses', () => {
  // Loopback / Unspecified
  assert.equal(isPrivateIPv6('::1'), true);
  assert.equal(isPrivateIPv6('::'), true);

  // Unique Local / Link Local
  assert.equal(isPrivateIPv6('fc00::1'), true);
  assert.equal(isPrivateIPv6('fd00::1'), true);
  assert.equal(isPrivateIPv6('fe80::1'), true);

  // IPv4-mapped IPv6
  assert.equal(isPrivateIPv6('::ffff:127.0.0.1'), true);
  assert.equal(isPrivateIPv6('::ffff:10.0.0.1'), true);
  assert.equal(isPrivateIPv6('::ffff:8.8.8.8'), false);

  // Public IPv6
  assert.equal(isPrivateIPv6('2607:f8b0:4005:805::200e'), false);
});

test('isPrivateHostname identifies reserved hostnames', () => {
  assert.equal(isPrivateHostname('localhost'), true);
  assert.equal(isPrivateHostname('sub.localhost'), true);
  assert.equal(isPrivateHostname('server.local'), true);
  assert.equal(isPrivateHostname('app.internal'), true);
  assert.equal(isPrivateHostname('127.0.0.1'), true);
  assert.equal(isPrivateHostname('10.0.0.5'), true);

  assert.equal(isPrivateHostname('example.com'), false);
  assert.equal(isPrivateHostname('google.com'), false);
});

test('validateUrlForSSRF blocks forbidden protocols and private hosts', async () => {
  // Invalid protocol
  const fileResult = await validateUrlForSSRF('file:///etc/passwd');
  assert.equal(fileResult.valid, false);

  const gopherResult = await validateUrlForSSRF('gopher://127.0.0.1');
  assert.equal(gopherResult.valid, false);

  // Private hosts
  const localhostResult = await validateUrlForSSRF('http://localhost');
  assert.equal(localhostResult.valid, false);

  const ipResult = await validateUrlForSSRF('http://127.0.0.1');
  assert.equal(ipResult.valid, false);

  const metadataResult = await validateUrlForSSRF('http://169.254.169.254/latest/meta-data');
  assert.equal(metadataResult.valid, false);
});

test('validateUrlForSSRF allows valid public HTTP/HTTPS URLs', async () => {
  const result = await validateUrlForSSRF('https://example.com');
  assert.equal(result.valid, true);
  assert.ok(result.resolvedIps && result.resolvedIps.length > 0);
});
