import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
