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

  async NotificationCreation() {
    try {
      const [result] = await pool.query(
        `INSERT INTO notifications (title, message, not_status, user_id) VALUES (?, ?, ?, ?)`,
        [
          this.not_data.title,
          this.not_data.message,
          this.not_data.not_status,
          this.not_data.user_id,
        ]
      );

      return result;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async AllNotifications() {
    try {
      const [results] = await pool.query("SELECT * FROM notifications");
      return results;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async UpdateNotification() {
    try {
      const [results] = await pool.query(
        `UPDATE notifications SET not_status = ? WHERE not_id = ?`,
        ["read", this.not_data.not_id]
      );
      return results;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async DeleteNotification() {
    try {
      const [results] = await pool.query(
        `DELETE FROM notifications 
       WHERE created_at < NOW() - INTERVAL 1 MONTH 
       AND not_status = ?`,
        ["read"]
      );
      return results;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }
}
