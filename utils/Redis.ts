require("dotenv").config();
import { Redis } from "ioredis";

// for local development
export const redis = new Redis();
