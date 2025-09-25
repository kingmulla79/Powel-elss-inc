import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import { validateJobInformation } from "../middleware/jobs.validation";
import {
  JobByTechnicianController,
  JobCreationController,
  JobDeleteController,
  JobEditController,
  JobFetchController,
  JobRelatedJobsFetchController,
} from "../controllers/jobs.controllers";

const JobRouter = express.Router();

JobRouter.post(
  "/job-creation",
  // validateJobInformation(),
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobCreationController
);

JobRouter.get(
  "/all-jobs",
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobFetchController
);
JobRouter.get(
  "/my-jobs/:technicianId",
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobByTechnicianController
);

JobRouter.get(
  "/related-jobs/:job_list_id",
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobRelatedJobsFetchController
);

JobRouter.put(
  "/edit-jobs",
  validateJobInformation(),
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobEditController
);
JobRouter.delete(
  "/delete-job/:job_id",
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobDeleteController
);

export default JobRouter;
