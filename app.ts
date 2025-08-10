require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/Error";
import UserRouter from "./routes/user.routes";

export const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: "",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use("/api/auth", UserRouter);

app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
