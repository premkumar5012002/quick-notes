import { Redis } from "ioredis";

import { env } from "@/lib/env.mjs";

export const redis = new Redis(env.REDIS_URL);
redis.on("error", (err) => console.log("Redis Client Error", err));
