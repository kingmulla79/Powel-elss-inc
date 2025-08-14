import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import { validateJobInformation } from "../middleware/jobs.validation";
import {
  JobByTechnicianController,
  JobCreationController,
  JobDeleteController,
  JobEditController,
  JobFetchController,
} from "../controllers/jobs.controllers";

const JobRouter = express.Router();

JobRouter.post(
  "/job-creation",
  validateJobInformation(),
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
  authorizedRoles("system_admin", "technician"),
  JobByTechnicianController
);

JobRouter.put(
  "/edit-jobs",
  validateJobInformation(),
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin", "technician"),
  JobEditController
);
JobRouter.delete(
  "/delete-job/:job_id",
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobDeleteController
);

export default JobRouter;
