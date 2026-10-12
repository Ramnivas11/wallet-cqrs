import { Router } from "express";
import { WalletController } from "./wallet.controller";
import {
  validateCreateWallet,
  validateWalletAmount,
  validateWalletId
} from "../../../infrastructure/middleware/validation.middleware";

const router = Router();
const walletController = new WalletController();

router.post(
  "/",
  validateCreateWallet,
  (req, res, next) => walletController.createWallet(req, res, next)
);

router.get(
  "/:id",
  validateWalletId,
  (req, res, next) => walletController.getWalletBalance(req, res, next)
);

router.get(
  "/:id/balance",
  validateWalletId,
  (req, res, next) => walletController.getWalletBalance(req, res, next)
);

router.get(
  "/:id/transactions",
  validateWalletId,
  (req, res, next) => walletController.getTransactionHistory(req, res, next)
);

router.get(
  "/:id/history",
  validateWalletId,
  (req, res, next) => walletController.getTransactionHistory(req, res, next)
);

router.post(
  "/:id/deposit",
  validateWalletId,
  validateWalletAmount,
  (req, res, next) => walletController.depositMoney(req, res, next)
);

router.post(
  "/deposit",
  validateWalletId,
  validateWalletAmount,
  (req, res, next) => walletController.depositMoney(req, res, next)
);

router.post(
  "/:id/withdraw",
  validateWalletId,
  validateWalletAmount,
  (req, res, next) => walletController.withdrawMoney(req, res, next)
);

router.post(
  "/withdraw",
  validateWalletId,
  validateWalletAmount,
  (req, res, next) => walletController.withdrawMoney(req, res, next)
);

export default router;
