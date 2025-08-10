import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/Errorhandler";
import { redis } from "../utils/Redis";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers["authorization"];

    const access_token = bearer && bearer.split(" ")[1];

    if (!access_token) {
      return next(
        new ErrorHandler(
          "Request headers must be set for authentication. Please check the request headers and ensure they are set properly",
          401
        )
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    if (!decoded) {
      return next(
        new ErrorHandler(
          "Invalid access token. Please refresh your application",
          401
        )
      );
    }
    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found. Please login", 401));
    }
    req.user = JSON.parse(user);
    next();
  }
);

export const authorizedRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.user_role || "")) {
      return next(
        new ErrorHandler(
          `Role ${req.user?.user_role} is not allowed to access this route`,
          403
        )
      );
    }
    next();
  };
};
