import { Request, Response } from "express";
import { EventStoreRepository } from "../infrastructure/event-store.repository";
import { CreateWalletHandler } from "../commands/create-wallet/create-wallet.handler";
import { DepositMoneyHandler } from "../commands/deposit-money/deposit-money.handler";
import { WithdrawMoneyHandler } from "../commands/withdraw-money/withdraw-money.handler";
import { WalletProjection } from "../projections/wallet.projection";
import { WalletReadRepository } from "../projections/wallet-read.repository";

const eventStore = new EventStoreRepository();

const walletReadRepository = new WalletReadRepository();

const walletProjection = new WalletProjection(
  walletReadRepository
);

const createWalletHandler = new CreateWalletHandler(
  eventStore,
  walletProjection
);

const depositMoneyHandler = new DepositMoneyHandler(
  eventStore,
  walletReadRepository
);

const withdrawMoneyHandler = new WithdrawMoneyHandler(
  eventStore,
  walletReadRepository
);

export class WalletController {
  async createWallet(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "userId is required"
        });
      }

      const result = await createWalletHandler.execute({
        userId
      });

      return res.status(201).json({
        message: "Wallet created successfully",
        data: result
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        message: error.message || "Internal server error"
      });
    }
  }

  async depositMoney(req: Request, res: Response) {
    try {
      const walletId = (req.params.id || req.body.walletId) as string;
      const { amountInPaise } = req.body;

      if (!walletId) {
        return res.status(400).json({
          message: "walletId is required"
        });
      }

      if (amountInPaise === undefined || typeof amountInPaise !== "number") {
        return res.status(400).json({
          message: "amountInPaise must be a number"
        });
      }

      const result = await depositMoneyHandler.execute({
        walletId,
        amountInPaise
      });

      return res.status(200).json({
        message: "Money deposited successfully",
        data: result
      });
    } catch (error: any) {
      console.error(error);

      const statusCode =
        error.message === "Wallet not found"
          ? 404
          : error.message === "Deposit amount must be greater than zero"
          ? 400
          : 500;

      return res.status(statusCode).json({
        message: error.message || "Internal server error"
      });
    }
  }

  async withdrawMoney(req: Request, res: Response) {
    try {
      const walletId = (req.params.id || req.body.walletId) as string;
      const { amountInPaise } = req.body;

      if (!walletId) {
        return res.status(400).json({
          message: "walletId is required"
        });
      }

      if (amountInPaise === undefined || typeof amountInPaise !== "number") {
        return res.status(400).json({
          message: "amountInPaise must be a number"
        });
      }

      const result = await withdrawMoneyHandler.execute({
        walletId,
        amountInPaise
      });

      return res.status(200).json({
        message: "Money withdrawn successfully",
        data: result
      });
    } catch (error: any) {
      console.error(error);

      const statusCode =
        error.message === "Wallet not found"
          ? 404
          : error.message === "Insufficient balance" ||
            error.message === "Withdraw amount must be greater than zero"
          ? 400
          : 500;

      return res.status(statusCode).json({
        message: error.message || "Internal server error"
      });
    }
  }
}
