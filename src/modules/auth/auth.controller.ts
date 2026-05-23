import type { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.services";
import sendResponse from "@/utils/sendResponse";
import status from "http-status";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authServices.loginUser(req.body);

    sendResponse(res, status.OK, {
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = { login };
