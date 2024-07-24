import { Request, Response, NextFunction } from "express";
import { UnAuthenticatedError } from "../errors/custom-error.js";
import { AuthenticatedRequest } from "../types/types.js";
import { verifyJWT } from "../utils/token-utils.js";

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new UnAuthenticatedError("Invalid Credentials"));
  }

  try {
    const { userId } = verifyJWT(token);
    req.user = { userId };
    next();
  } catch (error) {
    return next(new UnAuthenticatedError("Invalid Credentials"));
  }
};
