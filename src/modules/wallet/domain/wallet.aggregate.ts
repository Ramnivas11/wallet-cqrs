import { WalletCreatedEvent } from "./events/wallet-created.event";

export interface MoneyDepositedEvent {
  type: "MoneyDeposited";
  data: {
    amountInPaise: number;
  };
}

export interface MoneyWithdrawnEvent {
  type: "MoneyWithdrawn";
  data: {
  amountInPaise: number;
  };
}

export type WalletEvent =
  | WalletCreatedEvent
  | MoneyDepositedEvent
  | MoneyWithdrawnEvent;

export class WalletAggregate {
  private balanceInPaise = 0;
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
    return this.balanceInPaise;
  }

  getVersion() {
    return this.version;
  }

  getUncommittedEvents() {
    return this.uncommittedEvents;
  }

  
  deposit(amountInPaise: number) {
  if (amountInPaise <= 0) {
    throw new Error("Deposit amount must be greater than zero");
  }

  const event: MoneyDepositedEvent = {
    type: "MoneyDeposited",
    data: {
      amountInPaise
    }
  };

  this.apply(event);
  this.uncommittedEvents.push(event);
}

  private apply(event: WalletEvent) {
  switch (event.type) {
    case "WalletCreated":
      this.version++;
      break;

    case "MoneyDeposited":
      this.balanceInPaise += event.data.amountInPaise;
      this.version++;
      break;

    case "MoneyWithdrawn":
      this.balanceInPaise -= event.data.amountInPaise;
      this.version++;
      break;
  }
}
}

