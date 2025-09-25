import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import { LogFetchController } from "../controllers/logs.controllers";

const LogRouter = express.Router();

LogRouter.get(
  "/all-logs",
  isAuthenticated,
  authorizedRoles("system_admin", "operations_director", "admin"),
  LogFetchController
);

export default LogRouter;
