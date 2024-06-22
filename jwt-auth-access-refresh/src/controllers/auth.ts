import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/customError.js";

export const test = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("not found"));
};
