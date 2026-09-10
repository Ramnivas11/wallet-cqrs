import { prisma } from "../../../infrastructure/database/prisma";

export class WalletReadRepository {
  async create(
    walletId: string,
    userId: string,
    version: number
  ) {
    return prisma.walletReadModel.create({
      data: {
        walletId,
        userId,
        balance: 0,
        version
      }
    });
  }

  async findById(walletId: string) {
    return prisma.walletReadModel.findUnique({
      where: {
        walletId
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