require("dotenv").config();
import { Redis } from "ioredis";

// for local development
// export const redis = new Redis();

export const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
});
