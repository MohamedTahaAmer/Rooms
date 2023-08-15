// >(6:27) setting redis up
import { Redis } from "@upstash/redis";

// connecting to upstash
export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_SECRET!,
});
