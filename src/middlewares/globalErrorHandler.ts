import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ success: false, message: error.message });
};

export default globalErrorHandler;
