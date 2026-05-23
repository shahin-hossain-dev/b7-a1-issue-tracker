import { Router } from "express";
import { issueController } from "./issues.controller";
import auth from "@/middlewares/auth";

const router = Router();

router.post("", auth(), issueController.createIssue);

export const issueRouter = router;
