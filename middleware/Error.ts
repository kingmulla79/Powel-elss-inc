import ErrorHandler from "../utils/Errorhandler";
import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid JSONWebToken. Please check the authorization header.`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expired
  if (err.name === "TokenExpiredError") {
    const message = `Your URL token is expired. Please login again.`;
    err = new ErrorHandler(message, 400);
  }
  logger.error(err.message, {
    action: "User request error",
    status: "failed",
  });
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
