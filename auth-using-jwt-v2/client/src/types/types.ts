import { z } from "zod";
import {
  loginSchema,
  forgetPasswordSchema,
  signUpSchema,
  resetPasswordSchema,
} from "./validations";

export type TSignUpType = z.infer<typeof signUpSchema>;
export type TLoginType = z.infer<typeof loginSchema>;
export type TForgetPasswordType = z.infer<typeof forgetPasswordSchema>;
export type TResetPasswordType = z.infer<typeof resetPasswordSchema>;
