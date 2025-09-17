require("dotenv").config({ quiet: true });
import path from "path";
import mysqldump from "mysqldump";
import { logger } from "./logger";

export async function backupDatabase() {
  const BACKUP_PATH = path.join(
    __dirname,
    "../backups",
    `${process.env.DB_NAME}_${Date.now()}.sql`
  );
  try {
    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
      },
      dumpToFile: BACKUP_PATH,
    });
  } catch (err) {
    logger.error("System database backup failed:", err);
  }
}
