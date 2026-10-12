import {
  WalletEvent
} from "../wallet.aggregate";

interface StoredWalletEvent {
  eventType: string;
  eventData: any;
}

export function mapStoredEventToWalletEvent(
  event: StoredWalletEvent
): WalletEvent {
  switch (event.eventType) {
    case "WalletCreated":
      return {
        type: "WalletCreated",
        data: {
          walletId: event.eventData.walletId,
          userId: event.eventData.userId
        }
      };

    case "MoneyDeposited":
      return {
        type: "MoneyDeposited",
        data: {
          amountInPaise: event.eventData.amountInPaise
        }
      };

    case "MoneyWithdrawn":
      return {
        type: "MoneyWithdrawn",
        data: {
          amountInPaise: event.eventData.amountInPaise
        }
      };

    default:
      throw new Error(
        `Unknown wallet event: ${event.eventType}`
      );
  }
}