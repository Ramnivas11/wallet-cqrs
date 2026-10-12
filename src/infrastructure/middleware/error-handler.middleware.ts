import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // If already an instance of AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      error: err.name,
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  // Handle known domain error messages
  if (err?.message === "Wallet not found") {
    return res.status(404).json({
      status: "error",
      error: "NotFoundError",
      message: "Wallet not found"
    });
  }

  if (err?.message === "Insufficient balance") {
    return res.status(400).json({
      status: "error",
      error: "InsufficientBalanceError",
      message: "Insufficient balance in wallet"
    });
  }

  if (
    err?.message === "Deposit amount must be greater than zero" ||
    err?.message === "Withdraw amount must be greater than zero"
  ) {
    return res.status(400).json({
      status: "error",
      error: "ValidationError",
      message: err.message
    });
  }

  // Handle JSON parse syntax errors in request bodies
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      status: "error",
      error: "BadRequestError",
      message: "Malformed JSON payload"
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(500).json({
    status: "error",
    error: "InternalServerError",
    message: "Internal server error"
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: "error",
    error: "NotFoundError",
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
}
