import { Router } from "express";
import { issueController } from "./issues.controller";
import auth from "@/middlewares/auth";

const router = Router();

router.post("", auth(), issueController.createIssue);
router.get("", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", auth(), issueController.updateSingleIssue);
router.delete("/:id", auth(), issueController.deleteSingleIssue);

export const issueRouter = router;
