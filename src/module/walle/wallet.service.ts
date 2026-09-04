import { WalletRepository } from "./wallet.repository";

export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository
  ) {}

  async createWallet(userId: string) {
    return this.walletRepository.createWallet(userId);
  }

  async getWallet(walletId: string) {
    return this.walletRepository.findWalletById(walletId);
  }
}