import { Request } from "express";
import { IUser } from "../utils/types";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
