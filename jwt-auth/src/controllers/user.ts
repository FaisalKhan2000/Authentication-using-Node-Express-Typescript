import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/custom-error.js";
import { User } from "../models/user.js";
import { comparePassword } from "../utils/password-utils.js";
import { createJwt } from "../utils/token-utils.js";
import {
  TLoginType,
  TRegisterType,
  loginSchema,
  registerSchema,
} from "../validations/user-validations.js";

export const register = async (
  req: Request<{}, {}, TRegisterType>,
  res: Response,
  next: NextFunction
) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = validation.error.errors
      .map((err) => err.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  const { email } = validation.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new BadRequestError("User with this email already exists"));
  }

  const user = await User.create(validation.data);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User created successfully",
    user,
  });
};

export const login = async (
  req: Request<{}, {}, TLoginType>,
  res: Response,
  next: NextFunction
) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = validation.error.errors
      .map((err) => err.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError("User with this email doesn't exists"));
  }

  const isValidUser = await comparePassword(password, user?.password);
  if (!isValidUser) {
    return next(new UnAuthenticatedError("Invalid Credentials"));
  }

  const token = createJwt({ userId: user._id as mongoose.Types.ObjectId });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES_IN!)), // expires in 1day
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User Logged In successfully",
  });
};
