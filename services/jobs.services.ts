import {
  UserModelOperations,
  UserModelOperationsNoData,
} from "../models/user.model";
import { IJob, IUser } from "../utils/types";
import ErrorHandler from "../utils/Errorhandler";
import { logger } from "../utils/logger";
import bcrypt from "bcryptjs";
import { RefreshJWTTokens } from "../utils/jwt";
import { redis } from "../utils/Redis";
import {
  DeleteProfilePicture,
  UploadProfilePicture,
} from "../utils/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { JobModelOperations } from "../models/jobs.models";

export const JobCreationService = async (body: IJob) => {
  try {
    const jobCreation = new JobModelOperations(body);

    await jobCreation.JobCreation();
  } catch (error: any) {
    logger.error(`Error while sending activation mail. ${error.message}`);
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
    logger.error(`Error while logging in user: ${error.message}`);
    throw new ErrorHandler(error.message, 500);
  }
};
