import { Request, Response } from "express";
import { WalletRepository } from "./wallet.repository";
import { WalletService } from "./wallet.service";

const walletRepository = new WalletRepository();
const walletService = new WalletService(walletRepository);

export class WalletController {
  async createWallet(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "userId is required"
        });
      }

      const wallet = await walletService.createWallet(userId);

      return res.status(201).json({
        message: "Wallet created successfully",
        data: wallet
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }

  async getWallet(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const wallet = await walletService.getWallet(id as string);

      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found"
        });
      }

      return res.status(200).json({
        data: wallet
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }
}