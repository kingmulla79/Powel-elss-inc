import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  validateActivationRequest,
  validateLoginRequest,
  validatePasswordRequest,
  validateRegistrationRequest,
  validateRoleRequest,
} from "../middleware/user.validation";
import {
  UserAuthenticateUserController,
  UserDeleteUserController,
  UserGetAllUserInfoController,
  UserGetUserInfoController,
  UserLoginController,
  UserLogoutController,
  UserCreationController,
  UserUpdateAuthTokenController,
  UserUpdateUserInfoController,
  UserUpdateUserPasswordController,
  UserUpdateUserRoleController,
} from "../controllers/user.controllers";

const UserRouter = express.Router();

UserRouter.post(
  "/user-creation",
  validateRegistrationRequest(),
  UserCreationController
);

UserRouter.post("/login", validateLoginRequest(), UserLoginController);

UserRouter.get("/logout", isAuthenticated, UserLogoutController);

UserRouter.get("/refresh-tokens", UserUpdateAuthTokenController);

UserRouter.get("/user-information", isAuthenticated, UserGetUserInfoController);

UserRouter.get(
  "/all-user-information",
  isAuthenticated,
  authorizedRoles("system_admin"),
  UserGetAllUserInfoController
);

UserRouter.put(
  "/update-information",
  isAuthenticated,
  UserUpdateUserInfoController
);

UserRouter.put(
  "/update-password",
  validatePasswordRequest(),
  isAuthenticated,
  UserUpdateUserPasswordController
);

UserRouter.put(
  "/update-role",
  validateRoleRequest(),
  isAuthenticated,
  authorizedRoles("system_admin"),
  UserUpdateUserRoleController
);
UserRouter.delete(
  "/delete-user/:user_id",
  isAuthenticated,
  authorizedRoles("system_admin"),
  UserDeleteUserController
);

UserRouter.get(
  "/authenticate-user",
  isAuthenticated,
  UserAuthenticateUserController
);

export default UserRouter;
