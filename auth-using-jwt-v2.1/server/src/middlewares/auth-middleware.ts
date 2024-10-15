import { NextFunction, Response } from "express";
import {
  UnAuthenticatedError,
  UnAuthorizedError,
} from "../errors/custom-error.js";
import { User } from "../models/user.js";
import { AuthenticatedRequest } from "../types/types.js";
import { verifyJWT } from "../utils/token-utils.js";

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new UnAuthenticatedError("Invalid Credentials"));
  }

  try {
    const { userId, type } = verifyJWT(token);
    req.user = { userId, type };
    next();
  } catch (error) {
    return next(new UnAuthenticatedError("Invalid Credentials"));
  }
};

export const verifiedUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req?.user?.userId;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return next(new UnAuthenticatedError("Invalid Credentials"));
  }

  const { isVerified } = user;

  if (isVerified) {
    return next();
  } else {
    return next(new UnAuthenticatedError("Please verify your account"));
  }
};

export const authorizePermissions = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(roles);
    if (!roles.includes(req.user?.role as string)) {
      throw new UnAuthorizedError("Unauthorized to access this route");
    }

    next();
  };
};
