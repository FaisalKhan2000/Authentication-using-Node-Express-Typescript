import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
  UnAuthorizedError,
} from "../errors/custom-error.js";
import { User } from "../models/user.js";
import { AuthenticatedRequest } from "../types/types.js";
import { comparePassword, hashPassword } from "../utils/password-utils.js";
import { createJwt, verifyJWT } from "../utils/token-utils.js";
import {
  TForgetPasswordType,
  TLoginType,
  TRegisterType,
  TResetPasswordType,
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validations/user-validations.js";
import { sendResetMail } from "../utils/node-mailer.js";

export const signUp = async (
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

  res.status(StatusCodes.CREATED).json({
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

  const token = createJwt({ userId: user._id as string });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES_IN)),
    // secure: process.env.NODE_ENV === "production",
    secure: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User Logged In successfully",
  });
};

export const forgetPassword = async (
  req: Request<{}, {}, TForgetPasswordType>,
  res: Response,
  next: NextFunction
) => {
  const validation = forgetPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = validation.error.errors
      .map((err) => err.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  const { email } = validation.data;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError("User with this email doesn't exists"));
  }

  const token = createJwt({ userId: user._id as string });

  await sendResetMail({ userEmail: email, token });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Password reset email sent successfully",
  });
};

interface ResetPasswordParams {
  token: string;
}

export const resetPassword = async (
  req: Request<ResetPasswordParams, {}, TResetPasswordType>,
  res: Response,
  next: NextFunction
) => {
  const validation = resetPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = validation.error.errors
      .map((err) => err.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  const { password } = validation.data;

  const token = req.params.token;

  const { userId } = verifyJWT(token);
  if (!userId) {
    return next(new BadRequestError("no user id"));
  }
  const hashedPassword = await hashPassword(password);

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { password: hashedPassword },
    { new: true }
  );
  if (!user) {
    return next(new UnAuthorizedError("User not found"));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Password Updated Successfully",
    // hashedPassword: hashedPassword,
  });
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "user logged out!",
  });
};

export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return next(new NotFoundError("User not authenticated"));
  }

  const userExist = await User.findById(userId);
  if (!userExist) {
    return next(new NotFoundError("User not found"));
  }

  const users = await User.find({});

  res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
};
