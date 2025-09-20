require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";

export interface INotifications {
  not_id: string | number;
  title: string;
  message: string;
  not_status: string;
  user_id: string | number;
}

export class NotificationModelOperations {
  constructor(private not_data: Partial<INotifications>) {}

  NotificationCreation = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO notifications (title, message, not_status, user_id) VALUES (?, ?, ?, ?)`,
        [
          this.not_data.title,
          this.not_data.message,
          this.not_data.not_status,
          this.not_data.user_id,
        ],
        async (err, result: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(result);
        }
      );
    });
  };
  AllNotifications = () => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM notifications", async (err, results: any) => {
        if (err) {
          reject(new ErrorHandler(err, 500));
        }
        resolve(results);
      });
    });
  };
  UpdateNotification = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE notifications SET not_status = "read" WHERE not_id = ${this.not_data.not_id}`,
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(results);
        }
      );
    });
  };

  DeleteNotification = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM notifications read WHERE created_at < NOW() - INTERVAL 1 MONTH",
        [this.not_data.not_id],
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(results);
        }
      );
    });
  };
}
