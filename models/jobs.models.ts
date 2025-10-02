require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";
import { IJob } from "../utils/types";

export class JobModelOperations {
  constructor(private job_data: Partial<IJob>) {}

  JobCreation = async (
    cust_id: string,
    jobsArray: Array<Partial<IJob>>,
    created_by: string
  ) => {
    const connection = await pool.getConnection();
    try {
      (await connection).beginTransaction();

      const [jobListResult]: any = await connection.query(
        `INSERT INTO job_list (cust_id, created_by) VALUES ("${cust_id}", "${created_by}")`
      );

      const jobListId = jobListResult.insertId;

      const jobValues = jobsArray.map((job) => [
        job.job_title,
        job.job_type,
        job.job_status,
        job.job_description,
        job.job_location,
        job.priority,
        job.estimated_time,
        job.assigned_technician_id,
        job.scheduled_date,
        job.job_notes,
        jobListId,
      ]);
      await connection.query(
        `INSERT INTO jobs 
       (job_title, job_type, job_status, job_description, job_location, priority, estimated_time, assigned_technician_id, scheduled_date, job_notes, job_list_id) 
       VALUES ?`,
        [jobValues]
      );
      await connection.commit();
    } catch (error: any) {
      await connection.rollback();
      logger.error(error.sqlMessage, {
        action: "Job list creation",
        status: "failed",
      });
      throw new ErrorHandler(error, 500);
    } finally {
      connection.release();
    }
  };

  async AllTechnicianJobs() {
    try {
      const [results] = await pool.query(
        `SELECT * FROM job_info WHERE assigned_technician_id = ?`,
        [this.job_data.assigned_technician_id]
      );
      return results;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

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
  async AllJobs() {
    try {
      const [results] = await pool.query(`SELECT * FROM job_info`);
      return results;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async JobFilter(
    filter_column: string,
    filter_data: string
  ): Promise<Array<IJob>> {
    try {
      const allowedColumns = [
        "job_id",
        "job_list_id",
        "job_title",
        "job_type",
        "job_status",
        "job_location",
        "priority",
        "assigned_technician_id",
      ];

      if (!allowedColumns.includes(filter_column)) {
        throw new ErrorHandler(`Invalid filter column: ${filter_column}`, 400);
      }

      const query = `SELECT * FROM job_info WHERE ${filter_column} = ?`;

      const [results] = await pool.query(query, [filter_data]);
      return results as Array<IJob>;
    } catch (err: any) {
      throw new ErrorHandler(err, 500);
    }
  }

  async DeleteJob(job_id: string) {
    try {
      await pool.query(`UPDATE jobs SET deleted_at = NOW() WHERE job_id = ?`, [
        job_id,
      ]);
    } catch (error) {
      throw new ErrorHandler(error, 500);
    }
  }
  async PermanentJobDeletion() {
    try {
      await pool.query(
        `DELETE FROM jobs WHERE deleted_at < NOW() - INTERVAL 1 MONTH`
      );
    } catch (error) {
      throw new ErrorHandler(error, 500);
    }
  }
}
