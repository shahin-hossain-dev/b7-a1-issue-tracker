import express, { type Application } from "express";
import { userRouter } from "./modules/users/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { issueRouter } from "./modules/issues/issues.routes";

const app: Application = express();

// middleware
app.use(express.json());

//routes

const routes = [
  {
    route: "/api/users/",
    routeFn: userRouter,
  },
  {
    route: "/api/auth/",
    routeFn: authRouter,
  },
  {
    route: "/api/issues",
    routeFn: issueRouter,
  },
];

routes.forEach((item) => app.use(item.route, item.routeFn));

// global error handler
app.use(globalErrorHandler);

export default app;
