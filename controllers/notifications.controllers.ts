import { Response, Request, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import ErrorHandler from "../utils/Errorhandler";
import cron from "node-cron";
import { NotificationModelOperations } from "../models/notification.model";

//get all notifications by the latest entry
export const NotificationCreation = async (
  title: string,
  message: string,
  not_status: string,
  user_id: string | number
) => {
  try {
    const notification = new NotificationModelOperations({
      title,
      message,
      not_status,
      user_id,
    });
    await notification.NotificationCreation();
  } catch (error: any) {
    return new ErrorHandler(error.message, 500);
  }
};

export const GetNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update notifications
export const UpdateNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete read notifications
cron.schedule("59 23 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  console.log("_____________");
  console.log("running cron: deleting read notification");
});
