import { IExpenses, IInvoice } from "../utils/types";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import {
  ExpensesModelOperations,
  ExpensesModelOperationsNoData,
} from "../models/expenses.models";

export const ExpenseGenerationService = async (body: IInvoice) => {
  try {
    const expenseGeneration = new ExpensesModelOperations(body);

    await expenseGeneration.ExpenseGeneration();
  } catch (error: any) {
    logger.error(`Error while generating new expense: ${error.message}`, {
      action: "Expense generation",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const ExpenseFetchService = async (): Promise<{
  jobData: Array<any>;
}> => {
  try {
    let expenseData: any;
    const expenseFetch = new ExpensesModelOperationsNoData();

    await expenseFetch
      .AllExpenses()
      .then((results: any) => {
        expenseData = results;
      })
      .catch((error) => {
        logger.error(`Error while fetching expenses: ${error.message}`, {
          action: "Expense data fetch",
          status: "failed",
        });
        throw new ErrorHandler(error.message, 500);
      });
    return expenseData;
  } catch (error: any) {
    logger.error(`Error while fetching expense information: ${error.message}`, {
      action: "Expense information fetch",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const ExpensesEditService = async (body: IExpenses) => {
  try {
    const {
      expense_id,
      expense_description,
      expense_status,
      amount,
      category,
    } = body;

    const expenseData = new ExpensesModelOperationsNoData();

    const expenseResults = await expenseData.ExpenseFilter(
      `expense_id`,
      `${expense_id}`
    );

    if (expenseResults.length < 1) {
      logger.error(`No expense record with the specified expense id`, {
        action: "Expense information editing",
        status: "failed",
      });
      throw new ErrorHandler(
        "No expense record with the specified expense id",
        404
      );
    }

    if (
      expenseResults[0].expense_description === expense_description &&
      expenseResults[0].amount === amount &&
      expenseResults[0].expense_status === expense_status &&
      expenseResults[0].category === category
    ) {
      logger.error(
        "Updated expense information cannot be the same as the available one",
        {
          action: "Expense information editing",
          status: "failed",
        }
      );
      throw new ErrorHandler(
        `Updated expense invoice information cannot be the same as the available one`,
        409
      );
    }

    const expenseEdit = new ExpensesModelOperations(body);

    await expenseEdit.ExpenseEditing();
  } catch (error: any) {
    logger.error(`Error while editing expense information: ${error.message}`, {
      action: "Expense information editing",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const ExpenseDeleteService = async (expense_id: string) => {
  try {
    const expenseDelete = new ExpensesModelOperationsNoData();

    await expenseDelete.DeleteExpense(expense_id);
  } catch (error: any) {
    logger.error(
      `Error while deleting expense - ${expense_id}: ${error.message}`,
      {
        action: "Expense deletion",
        status: "failed",
      }
    );
    throw new ErrorHandler(error.message, 500);
  }
};

export const PermanentExpenseDeletionService = async () => {
  try {
    const expenseDelete = new ExpensesModelOperationsNoData();

    await expenseDelete.PermanentExpenseDeletion();
  } catch (error: any) {
    logger.error(`Error while deleting expense: ${error.message}`, {
      action: "Expense deletion",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};
