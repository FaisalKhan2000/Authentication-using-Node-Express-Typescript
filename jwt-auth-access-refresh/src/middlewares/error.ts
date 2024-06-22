import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMap: { [key: string]: number } = {
    NotFoundError: StatusCodes.NOT_FOUND,
    BadRequestError: StatusCodes.BAD_REQUEST,
    UnauthenticatedError: StatusCodes.UNAUTHORIZED,
    UnauthorizedError: StatusCodes.FORBIDDEN,
  };

  const statusCode = errorMap[error.name] || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message,
  });
};
