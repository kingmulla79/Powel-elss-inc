import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import { JobModelOperationsNoData } from "../models/jobs.models";
import { format } from "date-fns";
import { convertLogToJSON } from "../utils/logProcessing";
import path from "path";
import { ILogs } from "../utils/types";

export const LogFetchService = async (): Promise<any> => {
  try {
    const logs = convertLogToJSON(path.join(__dirname, "../logs/app.log"));
    return logs;
  } catch (error: any) {
    logger.error(`Error while fetching job information: ${error.message}`, {
      action: "Job information fetch",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};
