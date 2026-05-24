import type { AppError } from "@/errors/AppError";
import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res
    .status(error.statusCode || 500)
    .json({ success: false, message: error.message });
};

export default globalErrorHandler;
