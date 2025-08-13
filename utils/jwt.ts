require("dotenv").config();
import { Response } from "express";
import { redis } from "./Redis";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "./types";
import { logger } from "./logger";
import ErrorHandler from "./Errorhandler";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "0");

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

//jwt functions
export const GenerateJWTToken = (user: IUser) => {
  const accessToken = jwt.sign(
    { id: user.user_id },
    process.env.ACCESS_TOKEN || "",
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    { id: user.user_id },
    process.env.REFRESH_TOKEN || "",
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

export const RefreshJWTTokens = async (refresh_token: string) => {
  const decode = jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN as string
  ) as JwtPayload;
  if (!decode) {
    throw new ErrorHandler("Cannot refresh token", 401);
  }
  const session = await redis.get(decode.id as string);
  if (!session) {
    throw new ErrorHandler(
      "User not logged in. Please login to access these resources",
      401
    );
  }
  const user = JSON.parse(session);
  const tokens = GenerateJWTToken(user);
  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;
  await redis.set(user._id, JSON.stringify(user), "EX", 604800); //expires in seven days

  return { accessToken, refreshToken, user };
};

export const sendToken = (user: any, statusCode: number, res: Response) => {
  const tokens = GenerateJWTToken(user);
  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;

  //upload session to redis
  redis.set(user.user_id, JSON.stringify(user) as any, "EX", 604800);

  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  logger.info(
    `User ${user.first_name} ${user.surname}, id number ${user.user_id} logged in. Access and refresh tokens generated`
  );
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};
