require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";
import { IUser } from "../utils/types";

export class UserModelOperations {
  constructor(private user_data: Partial<IUser>) {}

  EmailQuery = async () => {
    try {
      const [rows] = (await pool.query("SELECT * FROM users WHERE email = ?", [
        this.user_data.email,
      ])) as any[];

      if (rows.length > 0) {
        logger.error("The email is already in use. Please choose another one", {
          action: "Email query",
          status: "failed",
        });

        throw new ErrorHandler(
          "The email is already in use. Please choose another one",
          409
        );
      }

      return rows;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Email query",
        status: "failed",
      });
      throw new ErrorHandler(err, 400);
    }
  };

  PhoneQuery = async () => {
    try {
      const [rows] = (await pool.query("SELECT * FROM users WHERE phone = ?", [
        this.user_data.phone,
      ])) as any[];

      if (rows.length > 0) {
        logger.error("The phone is already in use. Please choose another one", {
          action: "Phone query",
          status: "failed",
        });

        throw new ErrorHandler(
          "The phone is already in use. Please choose another one",
          409
        );
      }

      return rows;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Phone query",
        status: "failed",
      });
      throw new ErrorHandler(err, 400);
    }
  };

  UserCreation = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO users (email, first_name, surname, user_password, user_role, phone, dept_id) VALUES ("${this.user_data.email}", "${this.user_data.first_name}", "${this.user_data.surname}", "${this.user_data.user_password}", "${this.user_data.user_role}", "${this.user_data.phone}", "${this.user_data.dept_id}")`,
        async (err: any, result: any) => {
          if (err) {
            logger.error(err.sqlMessage, {
              action: "User creation",
              status: "failed",
            });
            reject(new ErrorHandler(err, 400));
          } else {
            resolve(result);
          }
        }
      );
    });
  };
  async UserLogin(): Promise<any> {
    try {
      const [rows] = (await pool.query(`SELECT * FROM users WHERE email = ?`, [
        this.user_data.email,
      ])) as any[];

      if (rows.length <= 0) {
        throw new ErrorHandler("Invalid email or password", 401);
      }

      return rows[0];
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async UserUpdateInfo(): Promise<any> {
    try {
      const [result] = await pool.query(
        `UPDATE users  SET first_name = ?, surname = ?, phone = ? WHERE user_id = ?`,
        [
          this.user_data.first_name,
          this.user_data.surname,
          this.user_data.phone,
          this.user_data.user_id,
        ]
      );

      return result;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async UserProfilePic(): Promise<any> {
    try {
      const [result] = await pool.query(
        `UPDATE users 
       SET avatar_public_id = ?, avatar_url = ? 
       WHERE user_id = ?`,
        [
          this.user_data.avatar_public_id,
          this.user_data.avatar_url,
          this.user_data.user_id,
        ]
      );

      return result; // contains info like affectedRows
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async UserUpdatePassword(): Promise<any> {
    try {
      const [result] = await pool.query(
        `UPDATE users 
       SET user_password = ? 
       WHERE user_id = ?`,
        [this.user_data.user_password, this.user_data.user_id]
      );

      return result; // contains affectedRows, changedRows, etc.
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }
}

export class UserModelOperationsNoData {
  async AllUsers(): Promise<any[]> {
    try {
      const [results] = await pool.query(`SELECT * FROM user_info`);

      return results as any[];
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async UserByEmail(email: string): Promise<any> {
    try {
      const [results] = await pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      const users = results as any[];

      if (users.length <= 0) {
        throw new ErrorHandler("No users by the provided email", 401);
      }

      return users[0];
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async UserById(user_id: number): Promise<any> {
    try {
      const [results] = await pool.query(
        `SELECT * FROM users WHERE user_id = ?`,
        [user_id]
      );

      const users = results as any[];

      if (users.length <= 0) {
        throw new ErrorHandler("No users by the provided id", 401);
      }

      return users[0];
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async UpdateRole(role: string, id: number): Promise<any> {
    try {
      const [result] = await pool.query(
        `UPDATE users SET user_role = ? WHERE user_id = ?`,
        [role, id]
      );

      return result;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async DeleteUser(user_id: number) {
    try {
      const [result] = await pool.query(
        `UPDATE users SET deleted_at = NOW() WHERE user_id = ?`,
        [user_id]
      );

      if ((result as any).affectedRows === 0) {
        throw new ErrorHandler("No user found with the provided id", 404);
      }
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }
  async PermanentUserDeletion() {
    try {
      await pool.query(
        `DELETE FROM users WHERE deleted_at < NOW() - INTERVAL 1 MONTH`
      );
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }
}
