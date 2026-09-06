import { WalletReadRepository } from "./wallet-read.repository";

export interface WalletCreatedProjectionEvent {
  type: "WalletCreated";

  data: {
    walletId: string;
    userId: string;
  };

  version: number;
}

export class WalletProjection {
  constructor(
    private readonly walletReadRepository: WalletReadRepository
  ) {}

  async handleWalletCreated(
    event: WalletCreatedProjectionEvent
  ) {
    await this.walletReadRepository.create(
      event.data.walletId,
      event.data.userId,
      event.version
    );
  }
}