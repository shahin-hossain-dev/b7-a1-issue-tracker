import type { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "@/utils/sendResponse";
import status from "http-status";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.headers.authorization);

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

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.getUserFromDB();

    sendResponse(res, status.OK, {
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const userController = { registerUser, getAllUser };
