import IORedis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: IORedis };

export function getRedisUrl(environment: NodeJS.ProcessEnv = process.env) {
  const url = environment.REDIS_URL ?? environment.redis_REDIS_URL;
  if (!url) throw new Error("Redis non configurato");
  return url;
}

export function getRedisConnection() {
  if (globalForRedis.redis) return globalForRedis.redis;

  const connection = new IORedis(getRedisUrl(), {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    tls: getRedisUrl().startsWith("rediss://") ? {} : undefined,
  });

  if (process.env.NODE_ENV !== "production") globalForRedis.redis = connection;
  return connection;
}

