require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";

import { logger } from "../utils/logger";
import { JobCreationService } from "../services/jobs.services";

export const JobCreationController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await JobCreationService(req.body);
      res.status(200).json({
        success: true,
        message: `New job created by user: ${req.user?.user_id}`,
      });
      logger.info(`New job created by user: ${req.user?.user_id}`);
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);
