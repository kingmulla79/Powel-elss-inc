// middlewares/validateRequest.ts
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { logger } from "../utils/logger";
import { InvoiceGenerationSchema } from "../models/invoice.validationSchema";

export const validateInvoiceGenerationRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      InvoiceGenerationSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.map((e) => {
          logger.error(e.message, {
            action: "Invoice generation data verification",
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
