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

// Function to verify a JWT
export const verifyJWT = (token: string): JwtPayload | null => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    // Handle the error or return null if the token is invalid
    return null;
  }
};
