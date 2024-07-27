import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  type: string;
}

export const createJwt = (payload: JwtPayload, time: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: time || "15d",
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
