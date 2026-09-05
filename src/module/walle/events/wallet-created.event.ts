export interface WalletCreatedEvent {
  type: "WalletCreated";

  data: {
    walletId: string;
    userId: string;
  };
}