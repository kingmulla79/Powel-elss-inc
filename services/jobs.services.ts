import { IJob } from "../utils/types";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import {
  JobModelOperations,
  JobModelOperationsNoData,
} from "../models/jobs.models";

export const JobCreationService = async (body: IJob) => {
  try {
    const jobCreation = new JobModelOperations(body);

    await jobCreation.JobCreation();
  } catch (error: any) {
    logger.error(`Error while sending activation mail. ${error.message}`);
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
        jobData = results;
      })
      .catch((error) => {
        logger.error(`Error while getting all job data: ${error.message}`);
        throw new ErrorHandler(error.message, 500);
      });
    return jobData;
  } catch (error: any) {
    logger.error(`Error while logging in user: ${error.message}`);
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
        logger.error(`Error while getting all job data: ${error.message}`);
        throw new ErrorHandler(error.message, 500);
      });
    return technicianJobData;
  } catch (error: any) {
    logger.error(`Error while logging in user: ${error.message}`);
    throw new ErrorHandler(error.message, 500);
  }
};

export const JobEditService = async (body: IJob) => {
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

    console.log(jobData);
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
    const jobUpdate = new JobModelOperations(body);

    await jobUpdate.JobUpdate();
  } catch (error: any) {
    logger.error(`Error while logging in user: ${error.message}`);
    throw new ErrorHandler(error.message, 500);
  }
};
