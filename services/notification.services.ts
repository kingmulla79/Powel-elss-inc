import { NotificationModelOperations } from "../models/notification.model";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import { IUser } from "../utils/types";

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
    throw new ErrorHandler(error.message, 500);
  }
};

export const NotificationFetchService = async (): Promise<{
  notificationData: Array<any>;
}> => {
  try {
    let notificationData: any;
    const notificationFetch = new NotificationModelOperations({});

    await notificationFetch
      .AllNotifications()
      .then((results: any) => {
        notificationData = results;
      })
      .catch((error) => {
        logger.error(
          `Error while fetching notification information: ${error.message}`,
          {
            action: "Notification fetch",
            status: "failed",
          }
        );
        throw new ErrorHandler(error.message, 500);
      });
    return notificationData;
  } catch (error: any) {
    logger.error(
      `Error while fetching notification information: ${error.message}`,
      {
        action: "Notification fetch",
        status: "failed",
      }
    );
    throw new ErrorHandler(error.message, 500);
  }
};

export const NotificationUpdateService = async (
  not_id: string,
  user_data: Partial<IUser>
) => {
  try {
    const notificationUpdate = new NotificationModelOperations({ not_id });

    await notificationUpdate
      .UpdateNotification()
      .then(() => {
        logger.info(
          `Notification: ${not_id} read by ${user_data.surname} - ${user_data.user_id}`,
          {
            user_id: `${user_data.user_id}`,
            user_name: `${user_data.first_name} ${user_data.surname}`,
            user_role: `${user_data.user_id}`,
            action: "Notification read",
            status: "success",
          }
        );
      })
      .catch((error) => {
        logger.error(
          `Error while updating notification information: ${error.message}`,
          {
            action: "Notification update",
            status: "failed",
          }
        );
        throw new ErrorHandler(error.message, 500);
      });
  } catch (error: any) {
    logger.error(
      `Error while updating notification information: ${error.message}`,
      {
        action: "Notification update",
        status: "failed",
      }
    );
    throw new ErrorHandler(error.message, 500);
  }
};

export const NotificationDeletionService = async () => {
  try {
    const notificationDeletion = new NotificationModelOperations({});

    await notificationDeletion
      .DeleteNotification()
      .then(() => {
        logger.info(`Notifications older than 30 days successfully deleted`, {
          action: "Notification deletion",
          status: "success",
        });
      })
      .catch((error) => {
        logger.error(
          `Error while deleting notification information: ${error.message}`,
          {
            action: "Notification deletion",
            status: "failed",
          }
        );
        throw new ErrorHandler(error.message, 500);
      });
  } catch (error: any) {
    logger.error(
      `Error while deleting notification information: ${error.message}`,
      {
        action: "Notification deletion",
        status: "failed",
      }
    );
    throw new ErrorHandler(error.message, 500);
  }
};
