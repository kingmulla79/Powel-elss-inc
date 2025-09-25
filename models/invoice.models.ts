require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";
import { IInvoice, IJob } from "../utils/types";

export class InvoiceModelOperations {
  constructor(private invoice_data: Partial<IInvoice>) {}

  async InvoiceCheck(): Promise<any> {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM invoices WHERE job_list_id = ?",
        [this.invoice_data.job_list_id]
      );

      const result = rows as any[];

      if (result.length > 0) {
        logger.error("There is an invoice record for the job services", {
          action: "Invoice job-list check",
          status: "failed",
        });
        throw new ErrorHandler(
          "There is an invoice record for the job services",
          409
        );
      }

      return result;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Invoice job-list check",
        status: "failed",
      });
      throw new ErrorHandler(err, 400);
    }
  }

  async InvoiceGeneration(): Promise<any> {
    try {
      const [result] = await pool.query(`CALL GenerateInvoice(?, ?, ?, ?)`, [
        this.invoice_data.job_list_id,
        this.invoice_data.amount,
        this.invoice_data.invoice_status,
        this.invoice_data.due_date,
      ]);

      return result;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Invoice generation",
        status: "failed",
      });
      throw new ErrorHandler(err, 400);
    }
  }

  async InvoiceEditing(): Promise<any> {
    try {
      const [result] = await pool.query(
        `UPDATE invoices SET invoice_status = ?, amount = ?, due_date = ? WHERE job_list_id = ?`,
        [
          this.invoice_data.invoice_status,
          this.invoice_data.amount,
          this.invoice_data.due_date,
          this.invoice_data.job_list_id,
        ]
      );

      return result;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Invoice information update",
        status: "failed",
      });
      throw new ErrorHandler(err, 400);
    }
  }
}

export class InvoiceModelOperationsNoData {
  async AllInvoices(): Promise<any> {
    try {
      const [results] = await pool.query(
        `SELECT DISTINCT
          i.invoice_id,
          i.invoice_code,
          i.job_list_id,
          COUNT(i.job_list_id) AS total_services,
          i.amount,
          i.invoice_status,
          i.due_date,
          j.cust_id,
          c.company_name,
          c.contact_first_name,
          c.contact_surname,
          c.email,
          c.phone
       FROM invoices i
       JOIN jobs j ON i.job_list_id = j.job_list_id
       JOIN customers c ON j.cust_id = c.cust_id
       GROUP BY i.invoice_id, i.invoice_code, i.job_list_id, 
                i.amount, i.invoice_status, i.due_date, 
                j.job_list_id, j.cust_id, 
                c.company_name, c.contact_first_name, c.contact_surname, c.email, c.phone`
      );

      return results;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "All invoices fetch",
        status: "failed",
      });
      throw new ErrorHandler(err, 500);
    }
  }

  async InvoiceFilter(
    filter_column: string,
    filter_data: string
  ): Promise<Array<any>> {
    try {
      // validate allowed filter columns to prevent SQL injection
      const allowedColumns = [
        "i.invoice_id",
        "i.invoice_code",
        "i.job_list_id",
        "i.amount",
        "i.invoice_status",
        "i.due_date",
        "j.cust_id",
        "c.company_name",
        "c.contact_first_name",
        "c.contact_surname",
        "c.email",
        "c.phone",
      ];

      if (!allowedColumns.includes(filter_column)) {
        throw new ErrorHandler("Invalid filter column", 400);
      }

      const [results] = await pool.query(
        `SELECT DISTINCT
          i.invoice_id,
          i.invoice_code,
          i.job_list_id,
          COUNT(i.job_list_id) AS total_services,
          i.amount,
          i.invoice_status,
          i.due_date,
          j.cust_id,
          c.company_name,
          c.contact_first_name,
          c.contact_surname,
          c.email,
          c.phone
       FROM invoices i
       JOIN jobs j ON i.job_list_id = j.job_list_id
       JOIN customers c ON j.cust_id = c.cust_id
       WHERE ${filter_column} = ?
       GROUP BY i.invoice_id, i.invoice_code, i.job_list_id,
                i.amount, i.invoice_status, i.due_date,
                j.job_list_id, j.cust_id,
                c.company_name, c.contact_first_name, c.contact_surname, c.email, c.phone`,
        [filter_data]
      );

      return results as Array<any>;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Invoice filter query",
        status: "failed",
      });
      throw new ErrorHandler(err, 500);
    }
  }

  async DeleteInvoice(invoice_id: string) {
    try {
      const [results] = await pool.query(
        `DELETE FROM invoices WHERE invoice_id = ?`,
        [invoice_id]
      );

      return results;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Delete invoice",
        status: "failed",
      });
      throw new ErrorHandler(err, 500);
    }
  }
}
