/**
 * Web Standard Request & Response Test Helpers
 */

require('../bootstrap');

let ipCounter = 1;

function generateTestIp() {
  const subnet = Math.floor(ipCounter / 250);
  const host = (ipCounter % 250) + 1;
  ipCounter++;
  return `10.200.${subnet}.${host}`;
}

function normalizeUrl(url) {
  if (typeof url !== 'string') return 'http://localhost:3000/';
  if (url.startsWith('/')) return `http://localhost:3000${url}`;
  if (!/^https?:\/\//i.test(url)) return `http://localhost:3000/${url}`;
  return url;
}

function createJsonRequest(url, bodyOrMethod = 'POST', maybeBody = {}, headers = {}) {
  const fullUrl = normalizeUrl(url);

  let method = 'POST';
  let body = {};
  let reqHeaders = {};

  if (typeof bodyOrMethod === 'string' && ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(bodyOrMethod.toUpperCase())) {
    method = bodyOrMethod.toUpperCase();
    body = maybeBody || {};
    reqHeaders = headers;
  } else if (typeof bodyOrMethod === 'object') {
    // Called as createJsonRequest(url, body, options)
    method = (maybeBody && maybeBody.method) || 'POST';
    body = bodyOrMethod;
    reqHeaders = (maybeBody && maybeBody.headers) || headers;
  }

  const defaultIp = generateTestIp();
  const finalHeaders = new Headers({
    'Content-Type': 'application/json',
    'x-forwarded-for': defaultIp,
    ...reqHeaders,
  });

  return new Request(fullUrl, {
    method,
    headers: finalHeaders,
    body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
  });
}

function createGetRequest(url, headers = {}) {
  const fullUrl = normalizeUrl(url);
  const defaultIp = generateTestIp();
  return new Request(fullUrl, {
    method: 'GET',
    headers: new Headers({
      'x-forwarded-for': defaultIp,
      ...headers,
    }),
  });
}

function createAuthorizedRequest(url, token = '1234', method = 'GET', body = null, headers = {}) {
  const fullUrl = normalizeUrl(url);
  const defaultIp = generateTestIp();
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'x-forwarded-for': defaultIp,
    ...headers,
  };

  return new Request(fullUrl, {
    method,
    headers: new Headers(authHeaders),
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
  });
}

module.exports = {
  normalizeUrl,
  createJsonRequest,
  createGetRequest,
  createAuthorizedRequest,
  generateTestIp,
};
