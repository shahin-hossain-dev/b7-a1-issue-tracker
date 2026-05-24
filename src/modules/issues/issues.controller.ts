import type { NextFunction, Request, Response } from "express";
import { issueServices } from "./issues.service";
import sendResponse from "@/utils/sendResponse";
import status from "http-status";
import type { TUser } from "../users/user.interface";
import type { JwtPayload } from "jsonwebtoken";

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

const getAllIssues = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issueServices.getAllIssuesFromDB();
    sendResponse(res, status.OK, {
      success: true,
      message: "Issues fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params as { id: string };
  try {
    const result = await issueServices.getSingleIssueFromDB(id);

    if (!result) {
      throw new Error("Issue not found");
    }

    sendResponse(res, status.OK, {
      success: true,
      message: "Issue fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params as { id: string };
  const body = req.body;
  const user = req.user;

  try {
    const result = await issueServices.updateSingleIssueIntoDB(
      id,
      body,
      user as TUser,
    );

    if (!result) {
      throw new Error("Issue not found");
    }

    sendResponse(res, status.OK, {
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateSingleIssue,
};
