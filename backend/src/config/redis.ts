import Redis from 'ioredis';

class MemoryHoldStore {
  private store: Map<string, { value: string; expiresAt: number }> = new Map();

  async set(key: string, value: string, mode?: string, duration?: number): Promise<void> {
    const expiresAt = duration ? Date.now() + duration * 1000 : Infinity;
    this.store.set(key, { value, expiresAt });
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const now = Date.now();
    const result: string[] = [];
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.store.delete(key);
        continue;
      }
      if (pattern === '*' || key.startsWith(pattern.replace('*', ''))) {
        result.push(key);
      }
    }
    return result;
  }
}

export interface IHoldCache {
  set(key: string, value: string, mode?: string, duration?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  keys(pattern: string): Promise<string[]>;
}

let redisClient: IHoldCache;

try {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null // Fail fast and fallback to memory
  });

  client.on('error', (err) => {
    console.warn('[Redis] Connection error, falling back to In-Memory Hold Store.');
    redisClient = new MemoryHoldStore();
  });

  client.on('connect', () => {
    console.log('[Redis] Connected to Redis Cache server.');
  });

  // Default initial client
  redisClient = client as unknown as IHoldCache;
} catch (error) {
  console.warn('[Redis] Initializing In-Memory Hold Store fallback.');
  redisClient = new MemoryHoldStore();
}

export const getHoldStore = (): IHoldCache => redisClient;
