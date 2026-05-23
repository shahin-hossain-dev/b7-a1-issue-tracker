import express, { type Application } from "express";
import { userRouter } from "./modules/users/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

export const app: Application = express();

// middleware
app.use(express.json());

app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);

// global error handler
app.use(globalErrorHandler);
