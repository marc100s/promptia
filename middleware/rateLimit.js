const rateLimitStore = new Map();

export const rateLimit = (req, options = {}) => {
  const { windowMs = 60000, maxRequests = 30 } = options;
  const key = req.headers.get('x-forwarded-for') || 'unknown';

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 0, resetTime: Date.now() + windowMs });
  }

  const record = rateLimitStore.get(key);

  if (Date.now() > record.resetTime) {
    record.count = 0;
    record.resetTime = Date.now() + windowMs;
  }

  record.count++;

  return {
    limited: record.count > maxRequests,
    remaining: Math.max(0, maxRequests - record.count),
    retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000),
  };
};
