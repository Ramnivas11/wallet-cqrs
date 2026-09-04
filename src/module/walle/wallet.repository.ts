import { prisma } from "../../infrastructure/database/prisma";

export class WalletRepository {
  async createWallet(userId: string) {
    return prisma.wallet.create({
      data: {
        userId
      }
    });
  }

  async findWalletById(walletId: string) {
    return prisma.wallet.findUnique({
      where: {
        id: walletId
      }
    });
  }
}