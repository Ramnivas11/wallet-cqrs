import { EventStoreRepository } from "../infrastructure/event-store.repository";

export interface TransactionAuditItem {
  eventId: string;
  walletId: string;
  type: "WALLET_CREATED" | "DEPOSIT" | "WITHDRAW";
  amountInPaise: number;
  balanceAfterPaise: number;
  version: number;
  occurredAt: Date;
  description: string;
}

export class TransactionHistoryProjection {
  constructor(private readonly eventStore: EventStoreRepository) {}

  async getHistoryByWalletId(walletId: string): Promise<TransactionAuditItem[]> {
    const events = await this.eventStore.getEvents(walletId);

    let runningBalance = 0;
    const history: TransactionAuditItem[] = [];

    for (const event of events) {
      let type: TransactionAuditItem["type"] = "WALLET_CREATED";
      let amount = 0;
      let description = "";

      const data = event.eventData as any;

      switch (event.eventType) {
        case "WalletCreated":
          type = "WALLET_CREATED";
          amount = 0;
          description = `Wallet initialized for user ${data?.userId || "unknown"}`;
          break;

        case "MoneyDeposited":
          type = "DEPOSIT";
          amount = data?.amountInPaise || 0;
          runningBalance += amount;
          description = `Deposited ₹${(amount / 100).toFixed(2)}`;
          break;

        case "MoneyWithdrawn":
          type = "WITHDRAW";
          amount = data?.amountInPaise || 0;
          runningBalance -= amount;
          description = `Withdrew ₹${(amount / 100).toFixed(2)}`;
          break;

        default:
          continue;
      }

      history.push({
        eventId: event.id,
        walletId: event.aggregateId,
        type,
        amountInPaise: amount,
        balanceAfterPaise: runningBalance,
        version: event.eventVersion,
        occurredAt: event.occurredAt,
        description
      });
    }

    return history;
  }
}
