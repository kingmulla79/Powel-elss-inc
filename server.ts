require("dotenv").config({ quiet: true });
import { app } from "./app";
import { logger } from "./utils/logger";
import http from "http";
import { v2 as cloudinary } from "cloudinary";
import { connectUserDatabase } from "./config/Database";

const server = http.createServer(app);

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

server.listen(process.env.PORT, () => {
  logger.info(`App listening on port ${process.env.PORT}`, {
    action: "App startup",
    status: "success",
  });
  connectUserDatabase()
    .then(() => {
      logger.info(`Database connected successfully`, {
        action: "Database connection",
        status: "success",
      });
    })
    .catch((error: any) => {
      logger.error(error, {
        action: "Database connection",
        status: "failed",
      });
    });
});
