import path from "path";
import winston from "winston";

const { combine, json, timestamp, errors, prettyPrint } = winston.format;

let winstonFormat =
  process.env.NODE_ENV === "development"
    ? combine(timestamp(), json(), errors({ stack: true }), prettyPrint())
    : combine(timestamp(), json(), errors({ stack: true }));

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winstonFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/app.log"),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/exception.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/rejections.log"),
    }),
  ],
  defaultMeta: {
    service: "Powel-elss-inc. logger system",
  },
});
