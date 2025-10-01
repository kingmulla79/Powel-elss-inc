require("dotenv").config({ quiet: true });
import ErrorHandler from "../utils/Errorhandler";
import { pool } from "../config/Database";
import { logger } from "../utils/logger";
import { IExpenses } from "../utils/types";

export class ExpensesModelOperations {
  constructor(private expense_data: Partial<IExpenses>) {}

  async ExpenseGeneration(): Promise<any> {
    try {
      const [result] = await pool.query(
        `CALL GenerateExpense(?, ?, ?, ?, ?, ?)`,
        [
          this.expense_data.invoice_id,
          this.expense_data.dept_id,
          this.expense_data.amount,
          this.expense_data.expense_description,
          this.expense_data.category,
          this.expense_data.expense_status,
        ]
      );

      return result;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Expense generation",
        status: "failed",
      });
      throw new ErrorHandler(err, 400);
    }
  }

  //   async InvoiceEditing(): Promise<any> {
  //     try {
  //       const [result] = await pool.query(
  //         `UPDATE invoices SET invoice_status = ?, amount = ?, due_date = ? WHERE job_list_id = ?`,
  //         [
  //           this.invoice_data.invoice_status,
  //           this.invoice_data.amount,
  //           this.invoice_data.due_date,
  //           this.invoice_data.job_list_id,
  //         ]
  //       );

  //       return result;
  //     } catch (err: any) {
  //       logger.error(err.sqlMessage, {
  //         action: "Invoice information update",
  //         status: "failed",
  //       });
  //       throw new ErrorHandler(err, 400);
  //     }
  //   }
}

export class InvoiceModelOperationsNoData {
  async AllInvoices(): Promise<any> {
    try {
      const [results] = await pool.query(`SELECT * FROM invoice_info`);

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
        "invoice_id",
        "invoice_code",
        "job_list_id",
        "amount",
        "invoice_status",
        "due_date",
        "cust_id",
        "company_name",
        "contact_first_name",
        "contact_surname",
        "email",
        "phone",
      ];

      if (!allowedColumns.includes(filter_column)) {
        throw new ErrorHandler("Invalid filter column", 400);
      }

      const [results] = await pool.query(
        `SELECT * FROM invoice_info WHERE ${filter_column} = ?`,
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
