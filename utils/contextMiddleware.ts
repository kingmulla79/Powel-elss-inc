import { Request, Response, NextFunction } from "express";
import { asyncLocalStorage } from "./logger";

export function contextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const forwarded = req.headers["x-forwarded-for"];
  let clientIp: string | undefined;

  if (typeof forwarded === "string") {
    clientIp = forwarded.split(",")[0].trim();
  } else if (Array.isArray(forwarded)) {
    clientIp = forwarded[0];
  } else {
    clientIp = req.socket.remoteAddress || "unknown";
  }

  clientIp = normalizeIp(clientIp);

  asyncLocalStorage.run({ ip: clientIp }, () => {
    next();
  });
}

function normalizeIp(ip: string | undefined): string {
  if (!ip) return "unknown";

  if (ip === "::1" || ip === "127.0.0.1") {
    return "localhost";
  }

  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  return ip;
}
