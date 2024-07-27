import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    type: string;
  };
  cookies: Record<string, string>;
}
