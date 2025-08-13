// middlewares/validateRequest.ts
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  UserActivationSchema,
  UserLoginSchema,
  UserPasswordSchema,
  UserProfilePicSchema,
  UserRegistrationSchema,
  UserRoleSchema,
} from "../models/user.validationSchema";
import { logger } from "../utils/logger";

export const validateRegistrationRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      UserRegistrationSchema.parse(req.body);
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

export const validateActivationRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      UserActivationSchema.parse(req.body);
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

export const validateLoginRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      UserLoginSchema.parse(req.body);
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

export const validateProfilePicRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      UserProfilePicSchema.parse(req.body);
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

export const validatePasswordRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      UserPasswordSchema.parse(req.body);
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

export const validateRoleRequest =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      UserRoleSchema.parse(req.body);
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
