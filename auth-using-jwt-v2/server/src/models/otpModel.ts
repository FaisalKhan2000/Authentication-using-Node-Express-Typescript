import { Document, Schema, model } from "mongoose";

interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 1, // TTL
  },
});

export const Otp = model<IOtp>("Otp", otpSchema);
