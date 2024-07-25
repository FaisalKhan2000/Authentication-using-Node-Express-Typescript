import { Request, Response, NextFunction } from "express";
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

  const statusCode = errorMap[error.name] || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message,
  });
};
