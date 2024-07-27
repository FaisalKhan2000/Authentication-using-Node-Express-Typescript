import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
  UnAuthorizedError,
} from "../errors/custom-error.js";
import { Otp } from "../models/otpModel.js";
import { User } from "../models/user.js";
import { AuthenticatedRequest } from "../types/types.js";
import { generateOtp } from "../utils/generate-otp.js";
import { sendOtpMail, sendResetMail } from "../utils/node-mailer.js";
import { comparePassword, hashPassword } from "../utils/password-utils.js";
import { createJwt, verifyJWT } from "../utils/token-utils.js";
import {
  TForgetPasswordType,
  TLoginType,
  TResetPasswordType,
  TSendOtp,
  TSignUpType,
  TVerificationType,
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  sendOtpSchema,
  signUpSchema,
  verificationSchema,
} from "../validations/user-validations.js";

export const signUp = async (
  req: Request<{}, {}, TSignUpType>,
  res: Response,
  next: NextFunction
) => {
  // validation
  const validation = signUpSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = validation.error.errors
      .map((err) => err.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  const { email } = validation.data;

  // checking for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new BadRequestError("User with this email already exists"));
  }

  // creating the user
  const user = await User.create(validation.data);
  user.save();

  // generating otp
  const otp = generateOtp() as string;

  // save otp to the otp database
  await Otp.create({ email, otp });

  // Send OTP via email
  try {
    await sendOtpMail({ userEmail: email, otp });
  } catch (error) {
    return next(new BadRequestError("Failed to send OTP email"));
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User created successfully",
    user,
  });
};

export const sendOtp = async (
  req: Request<{}, {}, TSendOtp>,
  res: Response,
  next: NextFunction
) => {
  const validation = sendOtpSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMessage = validation.error.errors
      .map((err) => err.message)
      .join(", ");

    return next(new BadRequestError(errorMessage));
  }

  const { email } = validation.data;

  // check for the user
  const user = await User.findOne({ email });

  if (!user) {
    return next(new BadRequestError("invalid email"));
  }

  if (user.isVerified) {
    return next(new BadRequestError("user is already verified"));
  }

  // generating otp
  const otp = generateOtp() as string;

  // save otp to the otp database
  await Otp.create({ email, otp });

  // Send OTP via email
  try {
    await sendOtpMail({ userEmail: email, otp });
  } catch (error) {
    return next(new BadRequestError("Failed to send OTP email"));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Otp Send Successfully",
  });
};

export const emailVerification = async (
  req: Request<{}, {}, TVerificationType>,
  res: Response,
  next: NextFunction
) => {
  const validation = verificationSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = validation.error.errors
      .map((err) => err.message)
      .join(", ");
    return next(new BadRequestError(errorMessage));
  }

  const { email, otp } = validation.data;

  // check for email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new BadRequestError("invalid email"));
  }

  // check for otp
  const verifyOtp = await Otp.findOne({ email, otp });
  if (!verifyOtp) {
    return next(new BadRequestError("invalid otp"));
  }

  // Update the user's verification status
  user.isVerified = true;
  await user.save();

  // deleting the otp from database
  await Otp.deleteOne({ email, otp });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User Verified successfully",
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

  //  find user
  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError("User with this email doesn't exists"));
  }

  // Check verification
  if (!user.isVerified) {
    return next(
      new BadRequestError("Please verify your email before logging in")
    );
  }

  // Compare Password
  const isValidUser = await comparePassword(password, user?.password);
  if (!isValidUser) {
    return next(new UnAuthenticatedError("Invalid Credentials"));
  }

  // Create JWT
  const token = createJwt(
    {
      userId: user._id as string,
      type: "login",
    },
    process.env.JWT_EXPIRES_IN as string
  );

  // Set Cookie
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES_IN)),
    secure: process.env.NODE_ENV === "production" ? true : false,
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

  // creating token for 5 minutes
  const token = createJwt(
    {
      userId: user._id as string,
      type: "reset",
    },
    process.env.JWT_PASSWORD_RESET_EXPIRES_IN as string
  );

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
