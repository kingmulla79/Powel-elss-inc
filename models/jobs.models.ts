require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";
import { IJob } from "../utils/types";

export class JobModelOperations {
  constructor(
    private job_data: {
      job_id?: any;
      job_title?: any;
      job_type?: string;
      job_status?: string;
      job_description?: string;
      job_location?: string;
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
        `INSERT INTO jobs (job_title, job_type, job_status, job_description, job_location, priority, estimated_time, assigned_technician_id, scheduled_date, job_notes) VALUES ("${this.job_data.job_title}", "${this.job_data.job_type}", "${this.job_data.job_status}", "${this.job_data.job_description}", "${this.job_data.job_location}", "${this.job_data.priority}", "${this.job_data.estimated_time}", "${this.job_data.assigned_technician_id}", "${this.job_data.scheduled_date}", "${this.job_data.job_notes}")`,
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
  AllTechnicianJobs = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT j.job_id, j.job_title, j.job_type, j.job_status, j.job_description, j.job_location, j.priority, j.estimated_time, j.scheduled_date, j.job_notes, j.assigned_technician_id, u.first_name as "technician_first_name", u.surname as "technician_surname", j.created_at, j.updated_at  FROM jobs j JOIN users u ON j.assigned_technician_id = u.user_id WHERE assigned_technician_id = ${this.job_data.assigned_technician_id}`,
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(results);
        }
      );
    });
  };
  JobUpdate = () => {
    return new Promise((resolve, reject) => {
      pool.query(
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
}

export class JobModelOperationsNoData {
  AllJobs = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT j.job_id, j.job_title, j.job_type, j.job_status, j.job_description, j.job_location, j.priority, j.estimated_time, j.scheduled_date, j.job_notes, j.assigned_technician_id, u.first_name as `technician_first_name`, u.surname as `technician_surname`, j.created_at, j.updated_at  FROM jobs j JOIN users u ON j.assigned_technician_id = u.user_id",
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          if (results.length <= 0) {
            reject(
              new ErrorHandler("There are no jobs yet in the database", 422)
            );
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
        `SELECT j.job_id, j.job_title, j.job_type, j.job_status, j.job_description, j.job_location, j.priority, j.estimated_time, j.scheduled_date, j.job_notes, j.assigned_technician_id, u.first_name as "technician_first_name", u.surname as "technician_surname", j.created_at, j.updated_at  FROM jobs j JOIN users u ON j.assigned_technician_id = u.user_id WHERE ${filter_column} = ${filter_data}`,
        async (err, results: any) => {
          if (err) {
            reject(new ErrorHandler(err, 500));
          }
          resolve(results);
        }
      );
    });
  };

  DeleteJob = (job_id: string) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM jobs WHERE job_id = ?`,
        [job_id],
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
