import { Request, Response } from "express";
import { EventStoreRepository } from "../infrastructure/event-store.repository";
import { CreateWalletHandler } from "../commands/create-wallet/create-wallet.handler";
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
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }
}
