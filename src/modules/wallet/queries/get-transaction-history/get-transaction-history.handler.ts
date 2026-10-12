import { GetTransactionHistoryQuery } from "./get-transaction-history.query";
import { TransactionHistoryProjection } from "../../projections/transaction-history.projection";
import { WalletReadRepository } from "../../projections/wallet-read.repository";

export class GetTransactionHistoryHandler {
  constructor(
    private readonly transactionHistoryProjection: TransactionHistoryProjection,
    private readonly walletReadRepository: WalletReadRepository
  ) {}

  async execute(query: GetTransactionHistoryQuery) {
    const wallet = await this.walletReadRepository.findById(query.walletId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const transactions =
      await this.transactionHistoryProjection.getHistoryByWalletId(
        query.walletId
      );

    return {
      walletId: query.walletId,
      userId: wallet.userId,
      currentBalanceInPaise: wallet.balance,
      totalTransactions: transactions.length,
      transactions
    };
  }
}
