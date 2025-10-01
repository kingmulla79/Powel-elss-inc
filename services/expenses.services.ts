import { IInvoice } from "../utils/types";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import { JobModelOperationsNoData } from "../models/jobs.models";
import {
  InvoiceModelOperations,
  InvoiceModelOperationsNoData,
} from "../models/invoice.models";
import { ExpensesModelOperations } from "../models/expenses.models";

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

export const InvoiceEditService = async (body: IInvoice) => {
  try {
    const { invoice_status, job_list_id, amount, due_date } = body;

    const invoiceData = new InvoiceModelOperationsNoData();

    const invoiceResults = await invoiceData.InvoiceFilter(
      `i.job_list_id`,
      `${job_list_id}`
    );

    if (invoiceResults.length < 1) {
      logger.error(`No invoice record with the specified job-list id`, {
        action: "Invoice information editing",
        status: "failed",
      });
      throw new ErrorHandler(
        "No invoice record with the specified job-list id",
        404
      );
    }

    if (
      invoiceResults[0].invoice_status === invoice_status &&
      invoiceResults[0].amount === amount &&
      invoiceResults[0].due_date === due_date
    ) {
      logger.error(
        "Updated invoice information cannot be the same as the available one",
        {
          action: "Invoice information editing",
          status: "failed",
        }
      );
      throw new ErrorHandler(
        `Updated invoice information cannot be the same as the available one`,
        409
      );
    }

    const invoiceEdit = new InvoiceModelOperations(body);

    await invoiceEdit.InvoiceEditing();
  } catch (error: any) {
    logger.error(`Error while editing invoice information: ${error.message}`, {
      action: "Invoice information editing",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const InvoiceFetchService = async (): Promise<{
  jobData: Array<any>;
}> => {
  try {
    let invoiceData: any;
    const invoiceFetch = new InvoiceModelOperationsNoData();

    await invoiceFetch
      .AllInvoices()
      .then((results: any) => {
        invoiceData = results;
      })
      .catch((error) => {
        logger.error(`Error while fetching invoices: ${error.message}`, {
          action: "Invoice data fetch",
          status: "failed",
        });
        throw new ErrorHandler(error.message, 500);
      });
    return invoiceData;
  } catch (error: any) {
    logger.error(`Error while fetching job information: ${error.message}`, {
      action: "Job information fetch",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const InvoiceDeleteService = async (invoice_id: string) => {
  try {
    const jobDelete = new JobModelOperationsNoData();

    await jobDelete.DeleteJob(invoice_id);
  } catch (error: any) {
    logger.error(
      `Error while deleting invoice - ${invoice_id}: ${error.message}`,
      {
        action: "Invoice deletion",
        status: "failed",
      }
    );
    throw new ErrorHandler(error.message, 500);
  }
};
