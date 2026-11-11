import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// Resilient fs.mkdir patch for Windows EPERM race conditions during webpack directory creation
if (process.platform === 'win32') {
  const fsAny = fs as any;
  const origMkdir = fsAny.mkdir.bind(fs);
  const origPromisesMkdir = fsAny.promises.mkdir.bind(fs.promises);
  const origMkdirSync = fsAny.mkdirSync.bind(fs);

  fsAny.mkdir = function (p: any, ...args: any[]) {
    const cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
    const opts = typeof args[0] === 'object' || typeof args[0] === 'number' ? args[0] : {};

    if (!cb) return origMkdir(p, ...args);

    let attempts = 0;
    const tryMkdir = () => {
      origMkdir(p, opts, (err: any, res: any) => {
        if (err && err.code === 'EPERM' && attempts < 15) {
          attempts++;
          setTimeout(tryMkdir, 30 * attempts);
        } else {
          cb(err, res);
        }
      });
    };
    tryMkdir();
  };

  fsAny.promises.mkdir = async function (p: any, opts: any) {
    let attempts = 0;
    while (true) {
      try {
        return await origPromisesMkdir(p, opts);
      } catch (err: any) {
        if (err && err.code === 'EPERM' && attempts < 15) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 30 * attempts));
        } else {
          throw err;
        }
      }
    }
  };

  fsAny.mkdirSync = function (p: any, opts: any) {
    let attempts = 0;
    while (true) {
      try {
        return origMkdirSync(p, opts);
      } catch (err: any) {
        if (err && err.code === 'EPERM' && attempts < 15) {
          attempts++;
          const end = Date.now() + 30 * attempts;
          while (Date.now() < end) {}
        } else {
          throw err;
        }
      }
    }
  };
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),
  async redirects() {
    return [
      {
        source: '/programs',
        destination: '/services',
        permanent: false,
      },
      {
        source: '/program',
        destination: '/services',
        permanent: false,
      },
      {
        source: '/internship/learn',
        destination: '/learning',
        permanent: false,
      },
      {
        source: '/learn',
        destination: '/learning',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
