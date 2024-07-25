import mongoose, { Schema, Document } from "mongoose";
import { hashPassword } from "../utils/password-utils.js";
import moment from "moment";

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
    password: {
      type: String,
      required: true,
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
}

userSchema.pre<IUser>("save", async function (next) {
  // hashing password
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  }
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);
