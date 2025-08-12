require("dotenv").config();
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { IUser } from "../utils/user.types";
import { logger } from "../utils/logger";

export class UserModelOperations {
  constructor(
    private user_data: {
      user_id?: any;
      first_name?: string;
      surname?: string;
      email?: string;
      user_password?: string;
      phone?: string;
      avatar?: string;
      avatar_public_id?: string;
      avatar_url?: string;
      user_role?: string;
      dept_id?: string;
    }
  ) {
    this.user_data = user_data;
  }

  EmailQuery = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM users WHERE email = ?",
        [this.user_data.email],
        (err, result: Array<any>) => {
          if (err) {
            logger.error(err);
            reject(new ErrorHandler(err, 400));
          }
          if (result.length > 0) {
            logger.error(
              "The email is already in use. Please choose another one"
            );
            reject(
              new ErrorHandler(
                "The email is already in use. Please choose another one",
                409
              )
            );
          }

          resolve(result);
        }
      );
    });
  };

  PhoneQuery = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM users WHERE phone = ?",
        [this.user_data.phone],
        (err, result: Array<any>) => {
          if (err) {
            logger.error(err);
            reject(new ErrorHandler(err, 400));
          }
          if (result.length > 0) {
            logger.error(
              "The phone is already in use. Please choose another one"
            );
            return reject(
              new ErrorHandler(
                "The phone is already in use. Please choose another one",
                409
              )
            );
          }
          resolve(result);
        }
      );
    });
  };

  UserCreation = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO users (email, first_name, surname, user_password, phone, dept_id) VALUES ("${this.user_data.email}", "${this.user_data.first_name}", "${this.user_data.surname}", "${this.user_data.user_password}", "${this.user_data.phone}", "${this.user_data.dept_id}")`,
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
  async UserLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [this.user_data.email],
        async (err, result: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          if (result.length <= 0) {
            reject(new ErrorHandler("Invalid email or password", 401));
          }
          resolve(result[0]);
        }
      );
    });
  }
  UserUpdateInfo = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE users SET first_name = ?, surname = ?, phone = ? WHERE user_id = ?`,
        [
          this.user_data.first_name,
          this.user_data.surname,
          this.user_data.phone,
          this.user_data.user_id,
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
  UserUpdatePassword = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE users SET user_password = ? WHERE user_id = ?`,
        [this.user_data.user_password, this.user_data.user_id],
        async (err, result: any) => {
          if (err) {
            return reject(new ErrorHandler(err, 500));
          }
          resolve(result);
        }
      );
    });
  };
}

export class UserModelOperationsNoData {
  AllUsers = () => {
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
