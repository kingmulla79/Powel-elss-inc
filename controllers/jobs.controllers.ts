require("dotenv").config({ quiet: true });
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import cron from "node-cron";
import { logger } from "../utils/logger";
import {
  JobByTechnicianService,
  JobCreationService,
  JobDeleteService,
  JobEditService,
  JobFetchService,
  PermanentJobDeletionService,
} from "../services/jobs.services";

export const JobCreationController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cust_id, jobs } = req.body;
      await JobCreationService(cust_id, jobs, req.user?.user_id);
      res.status(200).json({
        success: true,
        message: `New job created`,
      });
      logger.info(`New job created by user: ${req.user?.user_id}`);
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);

export const JobFetchController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobData = await JobFetchService();
      res.status(200).json({
        success: true,
        jobs: jobData,
        message: `All jobs data fetched successfully`,
      });
      logger.info(`All jobs data fetched by: ${req.user?.user_id}`);
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);

export const JobByTechnicianController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { technicianId } = req.params;
      const technicianJobData = await JobByTechnicianService(technicianId);
      res.status(200).json({
        success: true,
        jobs: technicianJobData,
        message: `All job data for the technician ${technicianId} fetched`,
      });
      logger.info(
        `All job data for the technician ${technicianId}fetched by: ${req.user?.user_id}`
      );
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);

export const JobEditController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await JobEditService(req.body);
      res.status(200).json({
        success: true,
        message: `Job ${req.body.job_id} successfully edited`,
      });
      logger.info(
        `Job ${req.body.job_id} successfully edited by : ${req.user?.user_id}`
      );
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);

export const JobDeleteController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { job_id } = req.params;
      await JobDeleteService(job_id);
      res.status(200).json({
        success: true,
        message: `Job ${job_id} successfully deleted`,
      });
      logger.info(
        `Job ${job_id} successfully deleted by : ${req.user?.user_id}`
      );
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);

cron.schedule("0 0 * * *", async () => {
  await PermanentJobDeletionService();
  logger.info("Removing deleted jobs", {
    action: "Jobs deletion",
    status: "success",
  });
  console.log("_____________");
  console.log("running cron: removing deleted jobs");
});
