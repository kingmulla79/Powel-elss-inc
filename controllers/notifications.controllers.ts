import { Response, Request, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import ErrorHandler from "../utils/Errorhandler";
import cron from "node-cron";
import {
  NotificationDeletionService,
  NotificationFetchService,
  NotificationUpdateService,
} from "../services/notification.services";
import { logger } from "../utils/logger";

export const GetNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationFetchService();
      res.status(200).json({
        success: true,
        message: "All notifications fetched successfully",
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update notifications
export const UpdateNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { not_id } = req.params;
      await NotificationUpdateService(not_id, req.user || {});
      res.status(200).json({
        success: true,
        message: "Notification read",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete read notifications
cron.schedule("0 0 * * *", async () => {
  await NotificationDeletionService();
  logger.info("Deleting read notification", {
    action: "Notification deletion",
    status: "success",
  });
  console.log("_____________");
  console.log("running cron: deleting read notification");
});
