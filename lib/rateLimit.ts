interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const ipLimits = new Map<string, RateLimitEntry>();
const userLimits = new Map<string, RateLimitEntry>();

function checkLimit(
  map: Map<string, RateLimitEntry>,
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = map.get(key);

  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}

export type RateLimitResult = ReturnType<typeof checkLimit>;

export const checkIpLimit = (ip: string) => checkLimit(ipLimits, ip, 10, 60_000);
export const checkUserLimit = (userId: string) => checkLimit(userLimits, userId, 20, 60_000);

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipLimits) {
    if (now > entry.resetAt) ipLimits.delete(key);
  }
  for (const [key, entry] of userLimits) {
    if (now > entry.resetAt) userLimits.delete(key);
  }
}, 5 * 60_000);
