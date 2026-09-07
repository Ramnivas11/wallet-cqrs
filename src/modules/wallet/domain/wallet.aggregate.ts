import { WalletCreatedEvent } from "./events/wallet-created.event";

export interface MoneyDepositedEvent {
  type: "MoneyDeposited";
  data: {
    amount: string;
  };
}

export interface MoneyWithdrawnEvent {
  type: "MoneyWithdrawn";
  data: {
    amount: string;
  };
}

export type WalletEvent =
  | WalletCreatedEvent
  | MoneyDepositedEvent
  | MoneyWithdrawnEvent;

export class WalletAggregate {
  private balance = 0;
  private version = 0;

  private uncommittedEvents: WalletEvent[] = [];

  constructor(
    private readonly walletId: string,
    private readonly userId: string
  ) {}

  create() {
    const event: WalletCreatedEvent = {
      type: "WalletCreated",
      data: {
        walletId: this.walletId,
        userId: this.userId
      }
    };

    this.apply(event);
    this.uncommittedEvents.push(event);
  }

  static rehydrate(
  walletId: string,
  userId: string,
  events: WalletEvent[]
) {
  const wallet = new WalletAggregate(
    walletId,
    userId
  );

  for (const event of events) {
    wallet.apply(event);
  }

  return wallet;
}

  getBalance() {
    return this.balance;
  }

  getVersion() {
    return this.version;
  }

  getUncommittedEvents() {
    return this.uncommittedEvents;
  }

  private apply(event: WalletEvent) {
    switch (event.type) {
      case "WalletCreated":
        this.version++;
        break;

      case "MoneyDeposited":
        this.balance += Number(event.data.amount);
        this.version++;
        break;

      case "MoneyWithdrawn":
        this.balance -= Number(event.data.amount);
        this.version++;
        break;
    }
  }
}
