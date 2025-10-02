import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { logger } from "../utils/logger";
import {
  ExpenseGenerationSchema,
  ExpenseUpdateSchema,
} from "../models/expenses.validationSchema";

export const validateExpenseGenerationRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      ExpenseGenerationSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.map((e) => {
          logger.error(e.message, {
            action: "Expense generation data verification",
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

export const validateExpenseUpdateRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      ExpenseUpdateSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.map((e) => {
          logger.error(e.message, {
            action: "Expense generation data verification",
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
