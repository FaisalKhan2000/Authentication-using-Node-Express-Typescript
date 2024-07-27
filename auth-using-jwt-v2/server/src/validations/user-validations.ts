import moment from "moment";
import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters long")
      .max(15, "First name should not be greater than 15 characters"),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters long")
      .max(15, "Last name should not be greater than 15 characters")
      .optional(),
    dob: z.string().refine(
      (val) => {
        const format = "YYYY-MM-DD";

        const date = moment(val, format, true);
        return date.isValid() && date.format(format) === val;
      },
      {
        message: "Invalid date format. Expected format is YYYY-MM-DD.",
      }
    ),

    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(12, "Password should not be greater than 12 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine(
    (data) => {
      return data.password && data.confirmPassword
        ? data.password === data.confirmPassword
        : true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type TSignUpType = z.infer<typeof signUpSchema>;

export const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type TSendOtp = z.infer<typeof sendOtpSchema>;

export const verificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "otp must be 6 characters long"),
});

export type TVerificationType = z.infer<typeof verificationSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(12, "Password should not be greater than 12 characters"),
});

export type TLoginType = z.infer<typeof loginSchema>;

export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type TForgetPasswordType = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(12, "Password should not be greater than 12 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine(
    (data) => {
      return data.password && data.confirmPassword
        ? data.password === data.confirmPassword
        : true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type TResetPasswordType = z.infer<typeof resetPasswordSchema>;
