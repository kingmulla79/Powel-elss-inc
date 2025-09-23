import { IInvoice, IJob } from "../utils/types";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import {
  JobModelOperations,
  JobModelOperationsNoData,
} from "../models/jobs.models";
import { format } from "date-fns";
import {
  InvoiceModelOperations,
  InvoiceModelOperationsNoData,
} from "../models/invoice.models";

export const InvoiceGenerationService = async (body: IInvoice) => {
  try {
    const invoiceGeneration = new InvoiceModelOperations(body);

    await invoiceGeneration.InvoiceGeneration();
  } catch (error: any) {
    logger.error(`Error while generating new invoice: ${error.message}`, {
      action: "Inventory generation",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const InvoiceEditService = async (body: IInvoice) => {
  try {
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

export const JobByTechnicianService = async (
  assigned_technician_id: string
): Promise<{ technicianJobData: Array<any> }> => {
  try {
    let technicianJobData: any;
    const technicianJobFetch = new JobModelOperations({
      assigned_technician_id,
    });

    await technicianJobFetch
      .AllTechnicianJobs()
      .then((results: any) => {
        technicianJobData = results;
      })
      .catch((error) => {
        logger.error(
          `Error while fetching jobs by tecnician - ${assigned_technician_id} : ${error.message}`,
          {
            action: "Technician job information fetch",
            status: "failed",
          }
        );
        throw new ErrorHandler(error.message, 500);
      });
    return technicianJobData;
  } catch (error: any) {
    logger.error(
      `Error while fetching jobs by tecnician - ${assigned_technician_id} : ${error.message}`,
      {
        action: "Technician job information fetch",
        status: "failed",
      }
    );
    throw new ErrorHandler(error.message, 500);
  }
};

export const JobEditService = async (body: IJob, user_role: string) => {
  try {
    const jobEntrySearch = new JobModelOperationsNoData();

    const jobData = await jobEntrySearch.JobFilter(
      "job_id",
      body.job_id ? body.job_id : ""
    );
    const {
      job_title,
      job_type,
      job_status,
      job_description,
      job_location,
      priority,
      estimated_time,
      assigned_technician_id,
      scheduled_date,
      job_notes,
    } = body;

    if (
      job_title === jobData[0].job_title &&
      job_type === jobData[0].job_type &&
      job_status === jobData[0].job_status &&
      job_description === jobData[0].job_description &&
      job_location === jobData[0].job_location &&
      priority === jobData[0].priority &&
      estimated_time === jobData[0].estimated_time &&
      assigned_technician_id?.toString() ===
        jobData[0].assigned_technician_id?.toString() &&
      scheduled_date === jobData[0].scheduled_date &&
      job_notes === jobData[0].job_notes
    ) {
      throw new ErrorHandler(
        `Updated job information cannot be the same as the available one`,
        409
      );
    }
    if (
      (job_status === "assigned" && user_role !== "system_admin") ||
      "admin" ||
      "operations_manager"
    ) {
      throw new ErrorHandler(
        `Unauthorized operations for user role: ${user_role}`,
        401
      );
    }
    const jobUpdate = new JobModelOperations(body);

    await jobUpdate.JobUpdate();
  } catch (error: any) {
    logger.error(`Error while updating job information: ${error.message}`, {
      action: "Job information update",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const JobDeleteService = async (job_id: string) => {
  try {
    const jobDelete = new JobModelOperationsNoData();

    await jobDelete.DeleteJob(job_id);
  } catch (error: any) {
    logger.error(`Error while deleting job - ${job_id}: ${error.message}`, {
      action: "Job deletion",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};
