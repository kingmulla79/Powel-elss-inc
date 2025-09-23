require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";
import { IInvoice, IJob } from "../utils/types";

export class InvoiceModelOperations {
  constructor(private inventory_data: Partial<IInvoice>) {}

  InvoiceGeneration = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `CALL GenerateInvoice(${this.inventory_data.job_list_id}, "${this.inventory_data.amount}", "${this.inventory_data.invoice_status}", ${this.inventory_data.due_date})`,
        async (err: any, result: any) => {
          if (err) {
            logger.error(err, {
              action: "Invoice generation",
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
}

export class InvoiceModelOperationsNoData {
  AllInvoices = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT DISTINCT
              i.invoice_code,
              i.job_list_id,
              COUNT(i.job_list_id) AS "total_services",
              i.amount,
              i.invoice_status,
              i.due_date,
              j.cust_id,
              c.company_name,
              c.contact_first_name,
              c.contact_surname,
              c.email,
              c.phone
          FROM
              invoices i
                  JOIN
              jobs j ON i.job_list_id = j.job_list_id
                  JOIN
              customers c ON j.cust_id = c.cust_id
          GROUP BY i.invoice_code , i.job_list_id , i.amount , i.invoice_status , i.due_date , j.job_list_id , j.cust_id , c.company_name , c.contact_first_name , c.contact_surname;`,
        async (err, results: any) => {
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
