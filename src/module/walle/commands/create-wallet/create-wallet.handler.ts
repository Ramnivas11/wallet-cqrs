import { randomUUID } from "crypto";
import { WalletAggregate } from "../../domain/wallet.aggregate";
import { EventStoreRepository } from "../../repositories/event-store.repository";
import { CreateWalletCommand } from "./create-wallet.command";

export class CreateWalletHandler {
  constructor(
    private readonly eventStore: EventStoreRepository
  ) {}

  async execute(command: CreateWalletCommand) {
    const walletId = randomUUID();

    const wallet = new WalletAggregate(
      walletId,
      command.userId
    );

    wallet.create();

    const events = wallet.getUncommittedEvents();

    for (const event of events) {
      await this.eventStore.append({
        aggregateId: walletId,
        aggregateType: "Wallet",
        eventType: event.type,
        eventVersion: wallet.getVersion(),
        eventData: event.data
      });
    }

    return {
      walletId
    };
  }
}