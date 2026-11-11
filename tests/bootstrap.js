/**
 * Dev Krafters Universal E2E Test Bootstrap
 * Sets up hermetic TypeScript/TSX transpilation, Next.js path aliasing (@/*),
 * and headless DOM / Web APIs for genuine opaque-box component and API testing.
 */

const Module = require('module');
const path = require('path');
const fs = require('fs');
const ts = require('typescript');
const React = require('react');

// 1. Root & Path Resolution Setup
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

// Active mock navigation state for parameterized testing
let activeSearchParams = new URLSearchParams();
let activeParams = {};
let activePathname = '/';

function setTestSearchParams(params) {
  if (params instanceof URLSearchParams) {
    activeSearchParams = params;
  } else if (typeof params === 'object') {
    activeSearchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      activeSearchParams.set(k, String(v));
    }
  } else if (typeof params === 'string') {
    activeSearchParams = new URLSearchParams(params.startsWith('?') ? params.slice(1) : params);
  }
}

function setTestParams(params) {
  activeParams = params || {};
}

function setTestPathname(pathname) {
  activePathname = pathname || '/';
}

function resetTestNavigation() {
  activeSearchParams = new URLSearchParams();
  activeParams = {};
  activePathname = '/';
}

// 2. Mock Navigation and Lucide Proxy
const createLucideIcon = (name) => {
  const Icon = React.forwardRef((props, ref) => {
    return React.createElement('svg', {
      'data-lucide': name,
      className: props.className,
      width: props.size || props.width || 24,
      height: props.size || props.height || 24,
      ...props,
      ref,
    });
  });
  Icon.displayName = name;
  return Icon;
};

const lucideMock = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    if (prop === '__esModule') return true;
    if (prop === 'default') return lucideMock;
    if (!target[prop]) {
      target[prop] = createLucideIcon(prop);
    }
    return target[prop];
  },
});

const nextNavigationMock = {
  __esModule: true,
  useSearchParams: () => activeSearchParams,
  useParams: () => activeParams,
  usePathname: () => activePathname,
  useRouter: () => ({
    push: (url) => {},
    replace: (url) => {},
    back: () => {},
    forward: () => {},
    prefetch: () => {},
    refresh: () => {},
  }),
  redirect: (url) => {
    const err = new Error(`NEXT_REDIRECT:${url}`);
    err.digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw err;
  },
  notFound: () => {
    const err = new Error('NEXT_NOT_FOUND');
    err.digest = 'NEXT_NOT_FOUND';
    throw err;
  },
  ReadonlyURLSearchParams: URLSearchParams,
};

// 3. Module Resolution Interceptor
const origResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  // Resolve @/ alias to src/
  if (request.startsWith('@/')) {
    request = path.join(srcDir, request.slice(2));
  }

  // Handle extensionless imports
  if (!path.extname(request) && !request.startsWith('node:')) {
    const candidates = ['.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx', '/index.js'];
    for (const ext of candidates) {
      if (fs.existsSync(request + ext)) {
        request = request + ext;
        break;
      }
    }
  }

  // Handle Next.js subpath exports
  if (request === 'next/server') {
    request = path.join(projectRoot, 'node_modules', 'next', 'server.js');
  }

  return origResolveFilename.call(this, request, parent, isMain, options);
};

// Pre-populate require.cache for lucide-react and next/navigation
const dummyLucidePath = path.join(projectRoot, 'node_modules', 'lucide-react', 'index.js');
require.cache[dummyLucidePath] = {
  id: dummyLucidePath,
  filename: dummyLucidePath,
  loaded: true,
  exports: lucideMock,
};

const dummyNavPath = path.join(projectRoot, 'node_modules', 'next', 'navigation.js');
require.cache[dummyNavPath] = {
  id: dummyNavPath,
  filename: dummyNavPath,
  loaded: true,
  exports: nextNavigationMock,
};

// Also intercept direct require
const origRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === 'lucide-react' || request.startsWith('lucide-react/')) {
    return lucideMock;
  }
  if (request === 'next/navigation') {
    return nextNavigationMock;
  }
  return origRequire.call(this, request);
};

// 4. TypeScript and TSX Transpilation Extension Hooks
const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
  jsx: ts.JsxEmit.ReactJSX,
  esModuleInterop: true,
  allowJs: true,
};

function transpileAndCompile(module, filename) {
  const sourceCode = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(sourceCode, {
    compilerOptions,
    fileName: filename,
  });
  module._compile(transpiled.outputText, filename);
}

require.extensions['.ts'] = transpileAndCompile;
require.extensions['.tsx'] = transpileAndCompile;

// 5. Headless Browser & Storage Shims
class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
  key(index) {
    return Array.from(this.store.keys())[index] || null;
  }
}

const memoryLocalStorage = new MemoryStorage();
const memorySessionStorage = new MemoryStorage();

if (typeof global.localStorage === 'undefined') {
  global.localStorage = memoryLocalStorage;
}
if (typeof global.sessionStorage === 'undefined') {
  global.sessionStorage = memorySessionStorage;
}

if (typeof global.window === 'undefined') {
  global.window = {
    localStorage: memoryLocalStorage,
    sessionStorage: memorySessionStorage,
    scrollY: 0,
    scrollTo: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    location: {
      href: 'https://devkrafters.com/',
      pathname: '/',
      search: '',
    },
    navigator: {
      clipboard: {
        writeText: async () => {},
      },
    },
  };
}

if (typeof global.document === 'undefined') {
  global.document = {
    documentElement: {
      setAttribute: () => {},
      getAttribute: () => null,
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
      },
    },
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
    createElement: () => ({
      setAttribute: () => {},
      click: () => {},
    }),
  };
}

if (typeof global.navigator === 'undefined') {
  global.navigator = global.window.navigator;
}

if (typeof global.CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  };
}

// 6. Automatically unref background intervals to prevent event-loop hangs
const originalSetInterval = global.setInterval;
global.setInterval = function (fn, ms, ...args) {
  const timer = originalSetInterval(fn, ms, ...args);
  if (timer && typeof timer.unref === 'function') {
    timer.unref();
  }
  return timer;
};

// 7. Default Hermetic Test Environment Variables
process.env.ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '1234';
process.env.ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev_krafters_super_secret_test_jwt_key_2026';
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devkrafters.com';
process.env.RESEND_API_KEY = 're_your_resend_api_key_here'; // Demo mode for hermetic tests

module.exports = {
  projectRoot,
  srcDir,
  memoryLocalStorage,
  memorySessionStorage,
  setTestSearchParams,
  setTestParams,
  setTestPathname,
  resetTestNavigation,
};
