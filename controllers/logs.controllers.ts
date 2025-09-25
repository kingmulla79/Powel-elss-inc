require("dotenv").config({ quiet: true });
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import { logger } from "../utils/logger";
import { LogFetchService } from "../services/logs.services";

export const LogFetchController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logData = await LogFetchService();
      res.status(200).json({
        success: true,
        logs: logData,
        message: `All log data fetched successfully`,
      });
      logger.info(`All log data fetched by: ${req.user?.user_id}`);
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);
