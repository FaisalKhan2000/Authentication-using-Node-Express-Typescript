import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface JwtPayload {
  userId: mongoose.Types.ObjectId;
}

export const createJwt = (payload: JwtPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15d",
  });

  return token;
};

export const verifyJWT = (token: string): JwtPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  return decoded;
};
