type Bucket = {
    tokens: number;
    lastRefill: number;
};

const buckets = new Map<string, Bucket>();

const MAX_TOKENS = 3;
const REFILL_INTERVAL = 10 * 60 * 1000;

export function consumeToken(key: string): boolean {
    const now = Date.now();

    let bucket = buckets.get(key);

    if (!bucket) {
        bucket = {
            tokens: MAX_TOKENS,
            lastRefill: now,
        };
    }

    const elapsed = now - bucket.lastRefill;

    const refill = Math.floor(elapsed / REFILL_INTERVAL);

    if (refill > 0) {
        bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refill);

        bucket.lastRefill = now;
    }

    if (bucket.tokens <= 0) {
        buckets.set(key, bucket);
        return false;
    }

    bucket.tokens--;

    buckets.set(key, bucket);

    return true;
}
