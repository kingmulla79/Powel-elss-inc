require("dotenv").config();
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";

export class JobModelOperations {
  constructor(
    private job_data: {
      job_title?: any;
      job_type?: string;
      job_description?: string;
      priority?: string;
      estimated_time?: string;
      assigned_technician_id?: string;
      scheduled_date?: string;
      job_notes?: string;
    }
  ) {
    this.job_data = job_data;
  }

  JobCreation = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO jobs (job_title, job_type, job_description, priority, estimated_time, assigned_technician_id, scheduled_date, job_notes) VALUES ("${this.job_data.job_title}", "${this.job_data.job_type}", "${this.job_data.job_description}", "${this.job_data.priority}", "${this.job_data.estimated_time}", "${this.job_data.assigned_technician_id}", "${this.job_data.scheduled_date}", "${this.job_data.job_notes}")`,
        async (err: any, result: any) => {
          if (err) {
            logger.error(err);
            reject(new ErrorHandler(err, 400));
          } else {
            resolve(result);
          }
        }
      );
    });
  };
}

export class JobModelOperationsNoData {
  AllJobs = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT u.user_id, u.first_name, u.surname, u.email, u.user_password, u.phone, u.avatar_public_id, u.avatar_url, u.user_role, d.dept_id, d.dept_name, u.created_at, u.updated_at  FROM users u JOIN department d ON u.dept_id = d.dept_id;`,
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          if (results.length <= 0) {
            reject(
              new ErrorHandler("There are no users yet in the database", 422)
            );
          }
          resolve(results);
        }
      );
    });
  };
  UserByEmail = (email: string) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          if (results.length <= 0) {
            reject(new ErrorHandler("No users by the provided email", 401));
          }
          resolve(results);
        }
      );
    });
  };
  UserById = (user_id: number) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM users WHERE user_id = ?`,
        [user_id],
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          if (results.length <= 0) {
            reject(new ErrorHandler("No users by the provided id", 401));
          }
          resolve(results);
        }
      );
    });
  };
  UpdateRole = (role: string, id: number) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE users SET user_role = ? WHERE user_id = ?`,
        [role, id],
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(results);
        }
      );
    });
  };
  DeleteUser = (user_id: number) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM users WHERE user_id = ?`,
        [user_id],
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
