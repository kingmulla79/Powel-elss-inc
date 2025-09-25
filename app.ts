require("dotenv").config({ quiet: true });
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/Error";
import UserRouter from "./routes/user.routes";
import JobRouter from "./routes/jobs.routes";
import { contextMiddleware } from "./utils/contextMiddleware";
import NotificationsRouter from "./routes/notifications.routes";
import InvoiceRouter from "./routes/invoice.routes";
import LogRouter from "./routes/logs.routes";

export const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(contextMiddleware);
app.use(
  cors({
    origin: "",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use("/api/auth", UserRouter);
app.use("/api/jobs", JobRouter);
app.use("/api/notifications", NotificationsRouter);
app.use("/api/invoice", InvoiceRouter);
app.use("/api/logs", LogRouter);

app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
