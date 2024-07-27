import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMap: { [key: string]: number } = {
    NotFoundError: StatusCodes.NOT_FOUND,
    BadRequestError: StatusCodes.BAD_REQUEST,
    UnAuthenticatedError: StatusCodes.UNAUTHORIZED,
    UnAuthorizedError: StatusCodes.FORBIDDEN,
  };

  // reset token
  if (error.name === "TokenExpiredError") {
    if (req.path.includes("/reset-password/")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Reset password token expired",
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token expired",
      });
    }
  } else if (error.name === "JsonWebTokenError") {
    // Handle invalid JWT format
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token format",
    });
  }

  const statusCode = errorMap[error.name] || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message,
  });
};
