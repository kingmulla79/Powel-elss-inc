import express from "express";
import {
  GetNotifications,
  UpdateNotifications,
} from "../controllers/notifications.controllers";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";

const NotificationsRouter = express.Router();

NotificationsRouter.get(
  "/get-notifications",
  isAuthenticated,
  authorizedRoles("system_admin"),
  GetNotifications
);
NotificationsRouter.put(
  "/update-notification/:not_id",
  isAuthenticated,
  authorizedRoles("system_admin"),
  UpdateNotifications
);

export default NotificationsRouter;
