import { IJob } from "../utils/types";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import {
  JobModelOperations,
  JobModelOperationsNoData,
} from "../models/jobs.models";
import { format } from "date-fns";

export const JobCreationService = async (
  cust_id: string,
  jobs: Array<Partial<IJob>>,
  user_id: string
) => {
  try {
    const jobCreation = new JobModelOperations({});

    await jobCreation.JobCreation(cust_id, jobs, user_id);
  } catch (error: any) {
    logger.error(`Error while creating new job: ${error.message}`, {
      action: "Job creation",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const JobFetchService = async (): Promise<{ jobData: Array<any> }> => {
  try {
    let jobData: any;
    const jobFetch = new JobModelOperationsNoData();

    await jobFetch
      .AllJobs()
      .then((results: any) => {
        results.forEach((result: any) => {
          const datetime = new Date(result.scheduled_date);
          const datePart = format(datetime, "yyyy-MM-dd");
          const timePart = format(datetime, "HH:mm:ss");
          result.scheduled_date = datePart;
          result.scheduled_time = timePart;
        });
        jobData = results;
      })
      .catch((error) => {
        logger.error(`Error while fetching job information: ${error.message}`, {
          action: "Job information fetch",
          status: "failed",
        });
        throw new ErrorHandler(error.message, 500);
      });
    return jobData;
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

export const JobEditService = async (body: IJob) => {
  try {
    const jobEntrySearch = new JobModelOperationsNoData();

    const jobData = await jobEntrySearch.JobFilter("job_id", body.job_id);

    if (jobData.length < 1) {
      logger.error(`No job record with the specified job_id`, {
        action: "Job information editing",
        status: "failed",
      });
      throw new ErrorHandler("No job record with the specified job_id", 404);
    }

    const datetime = new Date(jobData[0].scheduled_date);
    const datePart = format(datetime, "yyyy-MM-dd");
    const timePart = format(datetime, "HH:mm:ss");

    const databaseScheduledDate = `${datePart} ${timePart}`;

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
      jobData[0].job_title === job_title &&
      jobData[0].job_type === job_type &&
      jobData[0].job_status === job_status &&
      jobData[0].job_description === job_description &&
      jobData[0].job_location === job_location &&
      jobData[0].priority === priority &&
      jobData[0].estimated_time === estimated_time &&
      jobData[0].assigned_technician_id?.toString() ===
        assigned_technician_id?.toString() &&
      databaseScheduledDate === scheduled_date &&
      jobData[0].job_notes === job_notes
    ) {
      throw new ErrorHandler(
        `Updated job information cannot be the same as the available one`,
        409
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

export const PermanentJobDeletionService = async () => {
  try {
    const jobDeletion = new JobModelOperationsNoData();

    await jobDeletion
      .PermanentJobDeletion()
      .then(() => {
        logger.info(`Jobs deleted 30 days successfully removed`, {
          action: "Jobs deletion",
          status: "success",
        });
      })
      .catch((error: any) => {
        logger.error(
          `Error while deleting jobs information: ${error.message}`,
          {
            action: "Jobs deletion",
            status: "failed",
          }
        );
        throw new ErrorHandler(error.message, 500);
      });
  } catch (error: any) {
    logger.error(`Error while deleting jobs information: ${error.message}`, {
      action: "Jobs deletion",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};
