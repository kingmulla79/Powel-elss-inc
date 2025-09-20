import {
  UserModelOperations,
  UserModelOperationsNoData,
} from "../models/user.model";
import { IUser } from "../utils/types";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import bcrypt from "bcryptjs";
import { RefreshJWTTokens } from "../utils/jwt";
import { redis } from "../utils/Redis";
import {
  DeleteProfilePicture,
  UploadProfilePicture,
} from "../utils/cloudinary";
import { NotificationCreation } from "./notification.services";
import { INotifications } from "../models/notification.model";

export const UserCreationService = async (
  body: Pick<
    IUser,
    | "email"
    | "first_name"
    | "surname"
    | "user_password"
    | "user_role"
    | "phone"
    | "dept_id"
  >
) => {
  try {
    let {
      email,
      first_name,
      surname,
      user_password,
      user_role,
      phone,
      dept_id,
    } = body;

    const hashed_password = await bcrypt.hash(user_password, 10);

    user_password = hashed_password;

    const user_data = {
      email,
      first_name,
      surname,
      user_password,
      phone,
      user_role,
      dept_id,
    };
    const userRegistration = new UserModelOperations(user_data);

    await userRegistration.EmailQuery();
    await userRegistration.PhoneQuery();
    await userRegistration.UserCreation();
  } catch (error: any) {
    logger.error(`Error while creating user: ${error.message}`, {
      user_name: `${body.first_name} ${body.surname}`,
      action: "User account creation",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserLoginService = async (user: {
  email: string;
  user_password: string;
}): Promise<{ user_data: IUser }> => {
  try {
    const userLogin = new UserModelOperations(user);

    const user_data = await userLogin.UserLogin();
    const password_match = await bcrypt.compare(
      user.user_password,
      user_data.user_password
    );
    if (!password_match) {
      throw new ErrorHandler("Invalid email or password", 401);
    }
    return user_data;
  } catch (error: any) {
    logger.error(`Error while logging in user: ${error.message}`, {
      user_email: `${user.email}`,
      action: "Login",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserLogoutService = async (user: Partial<IUser>) => {
  try {
    await redis.del(user.user_id);
  } catch (error: any) {
    logger.error(`Error while logging out user: ${error.message}`, {
      user_id: `${user.user_id}`,
      action: "Logout",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserUpdateAuthTokenService = async (
  refresh_token: string
): Promise<{ accessToken: string; refreshToken: string; user: IUser }> => {
  try {
    const { accessToken, refreshToken, user } = await RefreshJWTTokens(
      refresh_token
    );

    return { accessToken, refreshToken, user };
  } catch (error: any) {
    logger.error(
      `Error while updating access and refresh tokens: ${error.message}`,
      {
        action: "Authentication token refresh",
        status: "failed",
      }
    );
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserGetUserInfoService = async (
  user_data: Partial<IUser>
): Promise<{ user: IUser }> => {
  try {
    let user;
    const UserJSON = await redis.get(user_data.user_id);
    if (UserJSON) {
      user = JSON.parse(UserJSON);
    }
    return user;
  } catch (error: any) {
    logger.error(`Error while getting user information: ${error.message}`, {
      user_id: `${user_data.user_id}`,
      user_name: `${user_data.first_name} ${user_data.surname}`,
      user_role: `${user_data.user_id}`,
      action: "User information fetch",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserGetAllUserInfoService = async (
  user_data: Partial<IUser>
): Promise<{
  userData: Array<any>;
}> => {
  try {
    let userData: any;
    const allUsersResults = new UserModelOperationsNoData();
    await allUsersResults
      .AllUsers()
      .then((results: any) => {
        userData = results;
      })
      .catch((error) => {
        logger.error(
          `Error while getting all user information: ${error.message}`,
          {
            user_id: `${user_data.user_id}`,
            user_name: `${user_data.first_name} ${user_data.surname}`,
            user_role: `${user_data.user_id}`,
            action: "All user information fetch",
            status: "failed",
          }
        );
        throw new ErrorHandler(error.message, 500);
      });
    return userData;
  } catch (error: any) {
    logger.error(`Error while getting all user information: ${error.message}`, {
      user_id: `${user_data.user_id}`,
      user_name: `${user_data.first_name} ${user_data.surname}`,
      user_role: `${user_data.user_id}`,
      action: "All user information fetch",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserUpdateUserInfoService = async (
  user_data: Partial<IUser>,
  body: {
    first_name?: string;
    surname?: string;
    phone?: string;
    user_id: string;
  }
): Promise<any> => {
  try {
    let { first_name, surname, phone, user_id } = body;

    let user;

    if (!first_name && !surname && !phone) {
      throw new ErrorHandler(`No information to update`, 422);
    }

    const userObject = new UserModelOperationsNoData();

    await userObject.UserById(parseInt(user_id)).then(async (result: any) => {
      user = result[0];

      if (
        user.first_name === first_name &&
        user.surname === surname &&
        user.phone === phone
      ) {
        throw new ErrorHandler(
          `Updated information cannot be the same as the available one`,
          409
        );
      }
      user.first_name = first_name || user.first_name;
      user.surname = surname || user.surname;
      user.phone = phone || user.phone;

      const userUpdate = new UserModelOperations(user);

      await userUpdate.UserUpdateInfo().catch((error) => {
        logger.error(
          `Error while running sql operation to update user information: ${error.message}`,
          {
            user_id: `${user_data.user_id}`,
            user_name: `${user_data.first_name} ${user_data.surname}`,
            user_role: `${user_data.user_id}`,
            action: "User information update",
            status: "failed",
          }
        );
        throw new ErrorHandler(error.message, 500);
      });
    });

    return user;
  } catch (error: any) {
    logger.error(`Error while updating user information: ${error.message}`, {
      user_id: `${user_data.user_id}`,
      user_name: `${user_data.first_name} ${user_data.surname}`,
      user_role: `${user_data.user_id}`,
      action: "User information update",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserUpdateProfilePicService = async (
  user_data: Partial<IUser>,
  avatar: string
) => {
  if (user_data.avatar_public_id) {
    await DeleteProfilePicture(user_data.avatar_public_id, user_data.user_id);
  }

  const { avatar_public_id, avatar_url } = await UploadProfilePicture(avatar);

  user_data.avatar_public_id = avatar_public_id;
  user_data.avatar_url = avatar_url;

  await redis.set(user_data.user_id, JSON.stringify(user_data));
  const UpdateProfilePic = new UserModelOperations({
    avatar_public_id,
    avatar_url,
    user_id: user_data.user_id,
  });

  await UpdateProfilePic.UserProfilePic();

  try {
  } catch (error: any) {
    logger.error(`Error while updating user password: ${error.message}`, {
      user_id: `${user_data.user_id}`,
      user_name: `${user_data.first_name} ${user_data.surname}`,
      user_role: `${user_data.user_id}`,
      action: "Profile picture update",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserUpdateUserPasswordService = async (
  body: { oldPassword: string; newPassword: string },
  user_data: Partial<IUser>
) => {
  try {
    const { oldPassword, newPassword } = body;

    const UserJSON = await redis.get(user_data.user_id);
    if (UserJSON) {
      let user: IUser = JSON.parse(UserJSON);
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.user_password
      );
      if (!isPasswordMatch) {
        logger.error("Invalid old password", {
          user_id: `${user_data.user_id}`,
          user_name: `${user_data.first_name} ${user_data.surname}`,
          user_role: `${user_data.user_id}`,
          action: "Password update",
          status: "failed",
        });
        throw new ErrorHandler("Invalid old password", 409);
      }
      if (isPasswordMatch && oldPassword === newPassword) {
        logger.error(`The old and new passwords cannot be the same`, {
          user_id: `${user_data.user_id}`,
          user_name: `${user_data.first_name} ${user_data.surname}`,
          user_role: `${user_data.user_id}`,
          action: "Password update",
          status: "failed",
        });
        throw new ErrorHandler(
          `The old and new passwords cannot be the same`,
          409
        );
      }
      const hashed_password = await bcrypt.hash(newPassword, 10);
      user.user_password = hashed_password;
      const passwordUpdate = new UserModelOperations(user);
      await passwordUpdate.UserUpdatePassword();
    }
  } catch (error: any) {
    logger.error(`Error while updating user password: ${error.message}`, {
      user_id: `${user_data.user_id}`,
      user_name: `${user_data.first_name} ${user_data.surname}`,
      user_role: `${user_data.user_id}`,
      action: "Password information update",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserUpdateUserRoleService = async (
  user_data: Partial<IUser>,
  body: {
    email: string;
    role: string;
  }
): Promise<{ updated_user_id: any }> => {
  try {
    let updated_user_id;
    const { email, role } = body;

    const userUpdate = new UserModelOperationsNoData();

    await userUpdate.UserByEmail(email).then(async (result: any) => {
      const userID = result[0].user_id;
      if (role == result[0].user_role) {
        logger.error(
          `The user role and desired update role must be different`,
          {
            user_id: `${user_data.user_id}`,
            user_name: `${user_data.first_name} ${user_data.surname}`,
            user_role: `${user_data.user_id}`,
            action: "User role update",
            status: "failed",
          }
        );
        throw new ErrorHandler(
          `The user role and desired update role must be different`,
          400
        );
      }
      await userUpdate.UpdateRole(role, userID);
      updated_user_id = userID;
    });
    return { updated_user_id };
  } catch (error: any) {
    logger.error(`Error while updating user password: ${error.message}`, {
      user_id: `${user_data.user_id}`,
      user_name: `${user_data.first_name} ${user_data.surname}`,
      user_role: `${user_data.user_id}`,
      action: "User role update",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};

export const UserDeleteUserService = async (
  user_data: Partial<IUser>,
  user_id: string
) => {
  try {
    const deleteUser = new UserModelOperationsNoData();

    await deleteUser.UserById(parseInt(user_id)).then(async (result: any) => {
      if (result[0].avatar_public_id) {
        await DeleteProfilePicture(
          result[0].avatar_public_id,
          result[0].user_id
        );
      }
    });
    const notification: Omit<INotifications, "not_id"> = {
      message: `User by id ${user_id} successfully deleted by ${user_data.user_id} - ${user_data.surname}`,
      not_status: "unread",
      title: "User account deletion",
      user_id: user_data.user_id,
    };
    NotificationCreation(
      notification.title,
      notification.message,
      notification.not_status,
      notification.user_id
    );
    await deleteUser.DeleteUser(parseInt(user_id)).then((result) => {
      logger.info(`The user by id ${user_id} successfully deleted`, {
        user_id: `${user_data.user_id}`,
        user_name: `${user_data.first_name} ${user_data.surname}`,
        user_role: `${user_data.user_id}`,
        action: "User role update",
        status: "success",
      });
    });
  } catch (error: any) {
    logger.error(`Error while deleting user information: ${error.message}`, {
      user_id: `${user_data.user_id}`,
      user_name: `${user_data.first_name} ${user_data.surname}`,
      user_role: `${user_data.user_id}`,
      action: "User role update",
      status: "failed",
    });
    throw new ErrorHandler(error.message, 500);
  }
};
