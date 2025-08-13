// middlewares/validateRequest.ts
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  UserLoginSchema,
  UserPasswordSchema,
  UserProfilePicSchema,
  UserRegistrationSchema,
  UserRoleSchema,
} from "../models/user.validationSchema";
import { logger } from "../utils/logger";
import { JobCreationSchema } from "../models/jobs.validationSchema";

export const validateJobCreation =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      JobCreationSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.map((e) => {
          logger.error(e.message);
        });
        res.status(422).json({
          success: false,
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
