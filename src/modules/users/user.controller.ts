import type { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "@/utils/sendResponse";
import status from "http-status";

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

export const userController = { getAllUser };
