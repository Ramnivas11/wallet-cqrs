import { Request, Response, NextFunction } from "express";
import { EventStoreRepository } from "../infrastructure/event-store.repository";
import { CreateWalletHandler } from "../commands/create-wallet/create-wallet.handler";
import { DepositMoneyHandler } from "../commands/deposit-money/deposit-money.handler";
import { WithdrawMoneyHandler } from "../commands/withdraw-money/withdraw-money.handler";
import { GetWalletBalanceHandler } from "../queries/get-wallet-balance/get-wallet-balance.handler";
import { GetTransactionHistoryHandler } from "../queries/get-transaction-history/get-transaction-history.handler";
import { WalletProjection } from "../projections/wallet.projection";
import { TransactionHistoryProjection } from "../projections/transaction-history.projection";
import { WalletReadRepository } from "../projections/wallet-read.repository";

const eventStore = new EventStoreRepository();

const walletReadRepository = new WalletReadRepository();

const walletProjection = new WalletProjection(
  walletReadRepository
);

const transactionHistoryProjection = new TransactionHistoryProjection(
  eventStore
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

const getWalletBalanceHandler = new GetWalletBalanceHandler(
  walletReadRepository
);

const getTransactionHistoryHandler = new GetTransactionHistoryHandler(
  transactionHistoryProjection,
  walletReadRepository
);

export class WalletController {
  async createWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;

      const result = await createWalletHandler.execute({
        userId
      });

      return res.status(201).json({
        message: "Wallet created successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async depositMoney(req: Request, res: Response, next: NextFunction) {
    try {
      const walletId = (req.params.id || req.body.walletId) as string;
      const { amountInPaise } = req.body;

      const result = await depositMoneyHandler.execute({
        walletId,
        amountInPaise
      });

      return res.status(200).json({
        message: "Money deposited successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async withdrawMoney(req: Request, res: Response, next: NextFunction) {
    try {
      const walletId = (req.params.id || req.body.walletId) as string;
      const { amountInPaise } = req.body;

      const result = await withdrawMoneyHandler.execute({
        walletId,
        amountInPaise
      });

      return res.status(200).json({
        message: "Money withdrawn successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getWalletBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const walletId = req.params.id as string;

      const result = await getWalletBalanceHandler.execute({
        walletId
      });

      return res.status(200).json({
        message: "Wallet fetched successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const walletId = req.params.id as string;

      const result = await getTransactionHistoryHandler.execute({
        walletId
      });

      return res.status(200).json({
        message: "Transaction history fetched successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
