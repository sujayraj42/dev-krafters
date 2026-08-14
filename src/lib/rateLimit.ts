interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Binary search helper to find the index of the first timestamp > cutoff.
 * Since timestamps are appended chronologically, the array is strictly sorted.
 */
function findFirstValidIndex(timestamps: number[], cutoff: number): number {
  let low = 0;
  let high = timestamps.length - 1;
  let result = timestamps.length;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    if (timestamps[mid] > cutoff) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return result;
}

/**
 * Clean up expired records across the store in O(1) boundary checks per entry
 * without array allocation overhead.
 */
export function cleanupRateLimits(now: number = Date.now(), windowMs: number = 60 * 1000): void {
  const cutoff = now - windowMs;
  for (const [ip, record] of rateLimitStore.entries()) {
    const timestamps = record.timestamps;
    const len = timestamps.length;

    // Fast O(1) checks using array boundary timestamps
    if (len === 0 || timestamps[len - 1] <= cutoff) {
      rateLimitStore.delete(ip);
    } else if (timestamps[0] <= cutoff) {
      const validIndex = findFirstValidIndex(timestamps, cutoff);
      if (validIndex >= len) {
        rateLimitStore.delete(ip);
      } else {
        timestamps.splice(0, validIndex);
      }
    }
    // If timestamps[0] > cutoff, all entries are valid, so no work is needed.
  }
}

/**
 * Utility function to reset store (used for tests/benchmarks).
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}

// Clean up expired records every 5 minutes to avoid memory leaks
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    cleanupRateLimits();
  }, 5 * 60 * 1000);
  if (timer && typeof timer === 'object' && 'unref' in timer && typeof timer.unref === 'function') {
    timer.unref();
  }
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }
  return '127.0.0.1';
}

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): { success: boolean; limit: number; remaining: number; resetMs: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  let record = rateLimitStore.get(identifier);

  if (!record) {
    record = { timestamps: [now] };
    rateLimitStore.set(identifier, record);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  const timestamps = record.timestamps;

  if (timestamps.length > 0) {
    if (timestamps[timestamps.length - 1] <= cutoff) {
      // Fast O(1): all timestamps expired
      timestamps.length = 0;
    } else if (timestamps[0] <= cutoff) {
      // Mixed: find first valid index and prune expired elements
      const validIndex = findFirstValidIndex(timestamps, cutoff);
      timestamps.splice(0, validIndex);
    }
  }

  if (timestamps.length >= limit) {
    const oldestTimestamp = timestamps[0];
    const resetMs = windowMs - (now - oldestTimestamp);
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs,
    };
  }

  timestamps.push(now);

  return {
    success: true,
    limit,
    remaining: limit - timestamps.length,
    resetMs: windowMs,
  };
}
