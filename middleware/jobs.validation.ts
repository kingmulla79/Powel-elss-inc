import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";
import { JobCreationSchema } from "../models/jobs.validationSchema";

export const validateJobInformation =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      JobCreationSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.map((e) => {
          logger.error(e.message, {
            action: "Job data verification",
            status: "failed",
          });
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
