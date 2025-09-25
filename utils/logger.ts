import path from "path";
import winston from "winston";
import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage();

const { combine, json, timestamp, errors, prettyPrint } = winston.format;

// Custom format to inject IP from AsyncLocalStorage
const addIpFormat = winston.format((info) => {
  const store: any = asyncLocalStorage.getStore();
  if (store?.ip) {
    info.ip = store.ip;
  }
  return info;
});

let winstonFormat =
  process.env.NODE_ENV === "development"
    ? combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        addIpFormat(),
        json(),
        errors({ stack: true }),
        prettyPrint()
      )
    : combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        addIpFormat(),
        json(),
        errors({ stack: true })
      );

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
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
    service: "Powelelss inc logger system",
  },
});
