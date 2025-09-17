require("dotenv").config({ quiet: true });
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import {
  UserDeleteUserService,
  UserGetAllUserInfoService,
  UserGetUserInfoService,
  UserLoginService,
  UserLogoutService,
  UserCreationService,
  UserUpdateAuthTokenService,
  UserUpdateUserInfoService,
  UserUpdateUserPasswordService,
  UserUpdateUserRoleService,
  UserUpdateProfilePicService,
} from "../services/user.services";
import { logger } from "../utils/logger";
import { refreshTokenOptions, sendToken } from "..//utils/jwt";
import { redis } from "../utils/Redis";
import cron from "node-cron";
import { backupDatabase } from "../utils/mysqldump";

export const UserCreationController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registrationResults = await UserCreationService(req.body);
      res.status(200).json({
        success: true,
        message: `New user: ${req.body.first_name} ${req.body?.surname} - email ${req.body.email} account succcessfully created`,
      });
      logger.info(
        `New user: ${req.body.first_name} ${req.body?.surname} - email ${req.body.email} account succcessfully created`,
        {
          user_name: `${req.body.first_name} ${req.body?.surname}`,
          action: "Account creation",
          status: "success",
        }
      );
    } catch (error: any) {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }
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
      await UserLogoutService(req.user || {});
      res.cookie("refresh_token", "", { maxAge: 1 });

      logger.info(
        `User ${req.user?.first_name} ${req.user?.surname} id number ${req.user?.user_id} succcessfully logged out`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "Logout",
          status: "success",
        }
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
      logger.info(
        `User authentication tokens successfully refreshed for user - ${user.first_name} ${user.surname} id number: ${user.user_id}`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "Authentication token refresh",
          status: "success",
        }
      );
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
      const user: any = await UserGetUserInfoService(req.user || {});
      logger.info(
        `User information successfully fetched - ${user.first_name} ${user.surname} id number: ${user.user_id}`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "User information fetch",
          status: "success",
        }
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
      const results = await UserGetAllUserInfoService(req.user || {});

      logger.info("All user information successfully fetched", {
        user_id: `${req.user?.user_id}`,
        user_name: `${req.user?.first_name} ${req.user?.surname}`,
        user_role: `${req.user?.user_id}`,
        action: "All user information fetch",
        status: "success",
      });
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
      const user = await UserUpdateUserInfoService(req.user || {}, req.body);

      const UserJSON = await redis.get(req.body.user_id);

      if (UserJSON) {
        await redis.set(req.body.user_id, JSON.stringify(user));
      }

      logger.info(
        `Information for user: ${req.user?.user_id} successfully updated`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "User information update",
          status: "success",
        }
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

export const UserUpdateProfilePicController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserUpdateProfilePicService(req.user || {}, req.body.avatar);

      logger.info(
        `Profile picture updated successfully for user by id: ${req.user?.user_id}`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "Profile picture update",
          status: "success",
        }
      );
      res.status(201).json({
        success: true,
        message: `Profile picture updated successfully.`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const UserUpdateUserPasswordController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserUpdateUserPasswordService(req.body, req.user || {});
      await redis.del(req.user?.user_id);
      logger.info(
        `Password updated successfully for user by id: ${req.user?.user_id}`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "Password update",
          status: "success",
        }
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
      const { updated_user_id } = await UserUpdateUserRoleService(
        req.user || {},
        req.body
      );
      await redis.del(updated_user_id);
      logger.info(
        `The user role of user with id ${updated_user_id} successfully updated`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "User role update",
          status: "success",
        }
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
      await UserDeleteUserService(req.user || {}, user_id);
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
        `The user by id ${req.user?.user_id} successfully authenticated`,
        {
          user_id: `${req.user?.user_id}`,
          user_name: `${req.user?.first_name} ${req.user?.surname}`,
          user_role: `${req.user?.user_id}`,
          action: "User authentication",
          status: "success",
        }
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

cron.schedule("0 0 * * *", () => {
  logger.info(`Backing up system database on ${new Date()}`, {
    action: "System database backup",
    status: "success",
  });
  backupDatabase();
});
