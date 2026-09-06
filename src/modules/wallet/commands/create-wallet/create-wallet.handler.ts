import { randomUUID } from "crypto";
import { WalletAggregate } from "../../domain/wallet.aggregate";
import { EventStoreRepository } from "../../infrastructure/event-store.repository";
import { WalletProjection } from "../../projections/wallet.projection";
import { CreateWalletCommand } from "./create-wallet.command";

export class CreateWalletHandler {
  constructor(
    private readonly eventStore: EventStoreRepository,
    private readonly walletProjection: WalletProjection
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
      const storedEvent = await this.eventStore.append({
        aggregateId: walletId,
        aggregateType: "Wallet",
        eventType: event.type,
        eventVersion: wallet.getVersion(),
        eventData: event.data
      });

      if (event.type === "WalletCreated") {
        await this.walletProjection.handleWalletCreated({
          type: "WalletCreated",
          data: event.data,
          version: storedEvent.eventVersion
        });
      }
    }

    return {
      walletId
    };
  }
}