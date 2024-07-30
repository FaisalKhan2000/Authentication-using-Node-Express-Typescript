// import { Request, Response, NextFunction } from "express";
// import { redis } from "../app.js";
// import { StatusCodes } from "http-status-codes";

// interface RateLimiterOptions {
//   allowedHits: number;
//   secondsWindow: number;
// }
// export const rateLimiter = ({
//   allowedHits,
//   secondsWindow,
// }: RateLimiterOptions) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const xForwardedFor = req.headers["x-forwarded-for"];

//     const clientIp =
//       (typeof xForwardedFor === "string" &&
//         xForwardedFor.split(",")[0].trim()) ||
//       req.socket.remoteAddress;

//     const requests = await redis.incr(clientIp as string);

//     // console.log("Number of request made so far", requests);

//     let ttl;
//     if (requests === 1) {
//       await redis.expire(clientIp as string, secondsWindow);
//       ttl = secondsWindow;
//     } else {
//       ttl = await redis.ttl(clientIp as string);
//     }

//     if (requests > allowedHits) {
//       return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
//         success: false,
//         message: `Please wait for ${ttl} seconds before trying again.`,
//       });
//     } else {
//       next();
//     }
//   };
// };

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { redis } from "../app.js";

interface RateLimiterOptions {
  allowedHits: number;
  secondsWindow: number;
  type: "key-based" | "ip-based";
  getKey?: (req: Request) => string;
}

export const rateLimiter = ({
  allowedHits,
  secondsWindow,
  type,
  getKey,
}: RateLimiterOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let key: string | null = null;

    if (type === "ip-based") {
      const xForwardedFor = req.headers["x-forwarded-for"];
      key =
        (typeof xForwardedFor === "string" &&
          xForwardedFor.split(",")[0].trim()) ||
        req.socket.remoteAddress ||
        null;
    } else if (type === "key-based" && getKey) {
      key = getKey(req);
    }

    if (!key) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to determine key for rate limiting.",
      });
    }

    // create requests increment
    const requests = await redis.incr(key);

    let ttl;
    if (requests === 1) {
      await redis.expire(key, secondsWindow);
      ttl = secondsWindow;
    } else {
      ttl = await redis.ttl(key);
    }

    if (requests > allowedHits) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: `Please wait for ${ttl} seconds before trying again.`,
      });
    } else {
      next();
    }
  };
};
