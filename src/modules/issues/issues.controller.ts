import type { NextFunction, Request, Response } from "express";
import { issueServices } from "./issues.service";
import sendResponse from "@/utils/sendResponse";
import status from "http-status";
import type { TUser } from "../users/user.interface";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const authUser = req.user as TUser;

  try {
    const result = await issueServices.createIssueIntoDB({
      ...body,
      reporter_id: authUser.id,
    });
    sendResponse(res, status.CREATED, {
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = { createIssue };
