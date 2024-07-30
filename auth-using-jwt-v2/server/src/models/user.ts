import mongoose, { Document, Schema, model } from "mongoose";
import { hashPassword } from "../utils/password-utils.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

interface IUser extends Document {
  firstName: string;
  lastName?: string;
  dob: Date;
  email: string;
  password: string;
  role?: "user" | "admin";
  isVerified: boolean;
}

userSchema.pre<IUser>("save", async function (next) {
  // hashing password
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  }
  next();
});

export const User = model<IUser>("User", userSchema);
