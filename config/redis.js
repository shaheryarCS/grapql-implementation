import Redis from "ioredis";

export const redisClient = new Redis({
    port: Number(6379),
    host:process.env.REDIS_HOST,
    connectTimeout:10000
})