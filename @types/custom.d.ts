import { Request } from "express";
import { IUser } from "../utils/user.types";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
