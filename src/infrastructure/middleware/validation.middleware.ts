import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/app-error";

export function validateCreateWallet(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const { userId } = req.body;

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    return next(new ValidationError("userId is required and must be a non-empty string"));
  }

  next();
}

export function validateWalletAmount(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const { amountInPaise } = req.body;

  if (amountInPaise === undefined || typeof amountInPaise !== "number") {
    return next(new ValidationError("amountInPaise is required and must be a number"));
  }

  if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
    return next(new ValidationError("amountInPaise must be a positive integer greater than zero"));
  }

  next();
}

export function validateWalletId(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const walletId = req.params.id || req.body.walletId;

  if (!walletId || typeof walletId !== "string" || walletId.trim() === "") {
    return next(new ValidationError("walletId is required and must be a valid non-empty string"));
  }

  next();
}
