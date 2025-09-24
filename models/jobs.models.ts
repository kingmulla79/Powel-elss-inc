require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";
import { IJob } from "../utils/types";

export class JobModelOperations {
  constructor(private job_data: Partial<IJob>) {}

  JobCreation = async (created_by: string) => {
    const connection = pool.getConnection();
    return new Promise((resolve, reject) => {
      connection;
      pool.query(
        `INSERT INTO job_list (created_by) VALUES ("${created_by}")`,
        async (err: any, result: any) => {
          if (err) {
            logger.error(err, {
              action: "Job list creation",
              status: "failed",
            });
            reject(new ErrorHandler(err, 400));
          } else {
            resolve(result);
          }
        }
      );
      pool.query(
        `INSERT INTO jobs (job_title, job_type, job_status, job_description, job_location, priority, estimated_time, assigned_technician_id, scheduled_date, job_notes) VALUES ("${this.job_data.job_title}", "${this.job_data.job_type}", "${this.job_data.job_status}", "${this.job_data.job_description}", "${this.job_data.job_location}", "${this.job_data.priority}", "${this.job_data.estimated_time}", "${this.job_data.assigned_technician_id}", "${this.job_data.scheduled_date}", "${this.job_data.job_notes}")`,
        async (err: any, result: any) => {
          if (err) {
            logger.error(err, {
              action: "Job creation",
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

  JobListCreation = (created_by: string) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO job_list (created_by) VALUES ("${created_by}")`,
        async (err: any, result: any) => {
          if (err) {
            logger.error(err, {
              action: "Job list creation",
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

  AllTechnicianJobs = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT j.job_id, j.job_list_id, j.job_title, j.job_type, j.job_status, j.job_description, j.job_location, j.priority, j.estimated_time, j.scheduled_date, j.job_notes, j.assigned_technician_id, u.first_name as "technician_first_name", u.surname as "technician_surname", j.created_at, j.updated_at  FROM jobs j JOIN users u ON j.assigned_technician_id = u.user_id WHERE assigned_technician_id = ${this.job_data.assigned_technician_id}`,
        async (err: any, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(results);
        }
      );
    });
  };

  JobUpdate = async () => {
    try {
      const [result] = await pool.query(
        `UPDATE jobs SET job_title = ?, job_type = ?, job_status = ?, job_description = ?, job_location = ?, priority = ?, estimated_time = ?, scheduled_date = ?, job_notes = ?, assigned_technician_id = ? WHERE job_id = ?`,
        [
          this.job_data.job_title,
          this.job_data.job_type,
          this.job_data.job_status,
          this.job_data.job_description,
          this.job_data.job_location,
          this.job_data.priority,
          this.job_data.estimated_time,
          this.job_data.scheduled_date,
          this.job_data.job_notes,
          this.job_data.assigned_technician_id,
          this.job_data.job_id,
        ]
      );
      return result;
    } catch (error) {
      throw new ErrorHandler(error, 500);
    }
  };
}

export class JobModelOperationsNoData {
  AllJobs = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT j.job_id, j.job_list_id, j.job_title, j.job_type, j.job_status, j.job_description, j.job_location, j.priority, j.estimated_time, j.scheduled_date, j.job_notes, j.assigned_technician_id, u.first_name as `technician_first_name`, u.surname as `technician_surname`, j.created_at, j.updated_at  FROM jobs j JOIN users u ON j.assigned_technician_id = u.user_id",
        async (err: any, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }

          resolve(results);
        }
      );
    });
  };

  JobFilter = (
    filter_column: string,
    filter_data: string
  ): Promise<Array<IJob>> => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT j.job_id, j.job_list_id, j.job_title, j.job_type, j.job_status, j.job_description, j.job_location, j.priority, j.estimated_time, j.scheduled_date, j.job_notes, j.assigned_technician_id, u.first_name as "technician_first_name", u.surname as "technician_surname", j.created_at, j.updated_at  FROM jobs j JOIN users u ON j.assigned_technician_id = u.user_id WHERE ${filter_column} = ${filter_data}`,
        async (err: any, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(results);
        }
      );
    });
  };

  DeleteJob = (job_id: string) => {
    try {
      pool.query(`DELETE FROM jobs WHERE job_id = ?`, [job_id]);
    } catch (error) {
      throw new ErrorHandler(error, 500);
    }
  };
}
