import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import { validateJobCreation } from "../middleware/jobs.validation";
import { JobCreationController } from "../controllers/jobs.controllers";

const JobRouter = express.Router();

JobRouter.post(
  "/job-creation",
  validateJobCreation(),
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  JobCreationController
);

export default JobRouter;
