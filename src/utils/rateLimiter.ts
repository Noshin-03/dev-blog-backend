type Bucket = {
    tokens: number;
    lastRefill: number;
};

const buckets = new Map<string, Bucket>();

const DEFAULT_MAX_TOKENS = 3;
const DEFAULT_REFILL_INTERVAL = 10 * 60 * 1000;

export function consumeToken(
    key: string,
    maxTokens: number = DEFAULT_MAX_TOKENS,
    refillIntervalMs: number = DEFAULT_REFILL_INTERVAL,
): boolean {
    const now = Date.now();

    let bucket = buckets.get(key);

    if (!bucket) {
        bucket = {
            tokens: maxTokens,
            lastRefill: now,
        };
    }

    const elapsed = now - bucket.lastRefill;
    const refill = Math.floor(elapsed / refillIntervalMs);

    if (refill > 0) {
        bucket.tokens = Math.min(maxTokens, bucket.tokens + refill);
        bucket.lastRefill += refill * refillIntervalMs;
    }

    if (bucket.tokens <= 0) {
        buckets.set(key, bucket);
        return false;
    }

    bucket.tokens--;
    buckets.set(key, bucket);
    return true;
}
