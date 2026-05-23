import type { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.services";
import sendResponse from "@/utils/sendResponse";
import status from "http-status";
import { userServices } from "../users/user.service";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userServices.registerUserIntoDB(req.body);

    sendResponse(res, status.CREATED, {
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
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

export const authController = { loginUser, registerUser };
