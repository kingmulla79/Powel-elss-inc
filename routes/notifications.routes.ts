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
  authorizedRoles("admin"),
  GetNotifications
);
NotificationsRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  UpdateNotifications
);

export default NotificationsRouter;
