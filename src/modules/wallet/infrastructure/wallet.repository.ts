import { prisma } from "../../../infrastructure/database/prisma";

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

  async updateBalance(
    walletId: string,
    balanceInPaise: number,
    version: number
  ) {
    return prisma.walletReadModel.update({
      where: {
        walletId
      },
      data: {
        balance: balanceInPaise,
        version
      }
    });
  }
}