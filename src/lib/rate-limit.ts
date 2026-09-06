export function createMemoryRateLimiter() {
  const buckets = new Map<string, number[]>();
  return (key: string, n: number, windowMs: number): boolean => {
    const now = Date.now();
    const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
    if (arr.length >= n) {
      buckets.set(key, arr);
      return false;
    }
    arr.push(now);
    buckets.set(key, arr);
    return true;
  };
}
