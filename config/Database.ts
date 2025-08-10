require("dotenv").config();
import mysql, { PoolOptions } from "mysql2";
import { Pool } from "mysql2/typings/mysql/lib/Pool";
import { logger } from "../utils/logger";
export let pool: Pool;

export const connectUserDatabase = async () => {
  try {
    const access: PoolOptions = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
    };
    pool = mysql.createPool(access);

    return pool;
  } catch (error: any) {
    logger.error(error.message);
    setTimeout(connectUserDatabase, 5000);
  }
};
