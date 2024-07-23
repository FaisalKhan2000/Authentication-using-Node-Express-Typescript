import { z } from "zod";

export const registerSchema = z
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
        const date = new Date(val);
        return !isNaN(date.getTime()); // isNaN is not valid and hence !isNaN is valid
      },
      {
        message: "Invalid date format",
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

export type TRegisterType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(12, "Password should not be greater than 12 characters"),
});

export type TLoginType = z.infer<typeof loginSchema>;
