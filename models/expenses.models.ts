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
          this.expense_data.job_list_id,
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

  async ExpenseEditing(): Promise<any> {
    try {
      const [result] = await pool.query(
        `UPDATE expenses SET expense_description = ?, amount = ?, expense_status = ?, category = ? WHERE expense_id = ?`,
        [
          this.expense_data.expense_description,
          this.expense_data.amount,
          this.expense_data.expense_status,
          this.expense_data.category,
          this.expense_data.expense_id,
        ]
      );

      return result;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Expense information update",
        status: "failed",
      });
      throw new ErrorHandler(err, 400);
    }
  }
}

export class ExpensesModelOperationsNoData {
  async AllExpenses(): Promise<any> {
    try {
      const [results] = await pool.query(`SELECT * FROM expenses`);

      return results;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "All invoices fetch",
        status: "failed",
      });
      throw new ErrorHandler(err, 500);
    }
  }

  async ExpenseFilter(
    filter_column: string,
    filter_data: string
  ): Promise<Array<any>> {
    try {
      const allowedColumns = [
        "expense_id",
        "expense_code",
        "job_list_id",
        "dept_id",
        "expense_description",
        "category",
        "amount",
        "expense_status",
      ];

      if (!allowedColumns.includes(filter_column)) {
        throw new ErrorHandler("Invalid filter column", 400);
      }

      const [results] = await pool.query(
        `SELECT * FROM expenses WHERE ${filter_column} = ?`,
        [filter_data]
      );

      return results as Array<any>;
    } catch (err: any) {
      logger.error(err.sqlMessage, {
        action: "Expenses filter query",
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
