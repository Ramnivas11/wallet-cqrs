import { GetWalletBalanceQuery } from "./get-wallet-balance.query";
import { WalletReadRepository } from "../../projections/wallet-read.repository";

export class GetWalletBalanceHandler {
  constructor(
    private readonly walletReadRepository: WalletReadRepository
  ) {}

  async execute(query: GetWalletBalanceQuery) {
    const walletReadModel =
      await this.walletReadRepository.findById(query.walletId);

    if (!walletReadModel) {
      throw new Error("Wallet not found");
    }

    return {
      walletId: walletReadModel.walletId,
      userId: walletReadModel.userId,
      balanceInPaise: walletReadModel.balance,
      version: walletReadModel.version,
      updatedAt: walletReadModel.updatedAt
    };
  }
}
