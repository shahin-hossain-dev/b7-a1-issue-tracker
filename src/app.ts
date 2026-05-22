import express, { type Application } from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";

export const app: Application = express();

// middleware
app.use(express.json());

// global error handler
app.use(globalErrorHandler);
