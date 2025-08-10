require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import {
  UserActivationService,
  UserDeleteUserService,
  UserGetAllUserInfoService,
  UserGetUserInfoService,
  UserLoginService,
  UserLogoutService,
  UserRegistrationService,
  UserUpdateAuthTokenService,
  UserUpdateUserInfoService,
  UserUpdateUserPasswordService,
  UserUpdateUserRoleService,
} from "../services/user.services";
import { logger } from "../utils/logger";
import { refreshTokenOptions, sendToken } from "..//utils/jwt";
import { redis } from "../utils/Redis";
import { isAuthenticated } from "../middleware/Auth";

export const UserRegistrationController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registrationResults = await UserRegistrationService(req.body);
      res.status(200).json({
        success: true,
        message: `Account creation successful. Check the email: ${registrationResults.email} for an activation code to complete the setup process`,
        activationToken: registrationResults.activationToken,
      });
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  }
);

export const UserActivationController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activationResults = await UserActivationService(req.body);

      logger.info(
        `${activationResults.first_name} ${activationResults.surname} registration information captured successfully`
      );
      res.status(201).json({
        success: true,
        message: `${activationResults.first_name} ${activationResults.surname} registration information captured successfully`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error, 500));
    }
  }
);

export const UserLoginController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_data = await UserLoginService(req.body);
      sendToken(user_data, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error, 500));
    }
  }
);

export const UserLogoutController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserLogoutService(req.user?.user_id);
      res.cookie("refresh_token", "", { maxAge: 1 });

      logger.info(
        `User ${req.user?.first_name} ${req.user?.surname} id number ${req.user?.user_id} succcessfully logged out`
      );
      res.status(200).json({
        success: true,
        message: `You are succcessfully logged out`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error, 500));
    }
  }
);

// update access token
export const UserUpdateAuthTokenController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken, user } =
        await UserUpdateAuthTokenService(req.cookies.refresh_token);
      req.user = user;
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      res.status(200).json({
        status: "success",
        message: "Authentication tokens successfully refreshed",
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserGetUserInfoController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await UserGetUserInfoService(req.user?.user_id);
      logger.info(
        `User information successfully fetched - ${user.first_name} ${user.surname} id number: ${user.user_id}`
      );
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserGetAllUserInfoController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await UserGetAllUserInfoService();

      logger.info("All user information successfully fetched");
      res.status(200).json({
        success: true,
        message: "All user information successfully fetched",
        users: results,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserUpdateUserInfoController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserUpdateUserInfoService(req.body);

      const UserJSON = await redis.get(req.body.user_id);

      if (UserJSON) {
        await redis.set(req.body.user_id, JSON.stringify(user));
      }

      logger.info(
        `Information for user: ${req.user?.user_id} successfully updated`
      );
      res.status(201).json({
        success: true,
        message: "Information successfully updated",
        // user: user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserUpdateUserPasswordController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserUpdateUserPasswordService(req.body, req.user?.user_id);
      await redis.del(req.user?.user_id);
      logger.info(
        `Password updated successfully for user by id: ${req.user?.user_id}`
      );
      res.status(201).json({
        success: true,
        message: `Password updated successfully. Login again to verify your identity`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserUpdateUserRoleController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { updated_user_id } = await UserUpdateUserRoleService(req.body);
      await redis.del(updated_user_id);
      logger.info(
        `The user role of user with id ${updated_user_id} successfully updated`
      );
      res.status(201).json({
        success: true,
        message: `The user role of user with id ${updated_user_id} successfully updated`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserDeleteUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.params;
      await UserDeleteUserService(user_id);
      res.status(200).json({
        success: true,
        message: `The user by id ${user_id} successfully deleted`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserAuthenticateUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(
        `The user by id ${req.user?.user_id} successfully authenticated`
      );
      res.status(201).json({
        success: true,
        message: `The user by id ${req.user?.user_id} successfully authenticated`,
        user: req.user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
