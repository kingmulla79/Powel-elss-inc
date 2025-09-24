require("dotenv").config({ quiet: true });
import { createPool, Pool, PoolOptions } from "mysql2/promise";
import { logger } from "../utils/logger";

export let pool: Pool;

export const connectUserDatabase = async () => {
  try {
    const access: PoolOptions = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    pool = createPool(access);
    return pool;
  } catch (error: any) {
    logger.error(error.message, {
      action: "Database connection",
      status: "failed",
    });
    setTimeout(connectUserDatabase, 5000);
  }
};
