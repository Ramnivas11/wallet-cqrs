import { WalletAggregate } from "./wallet.aggregate";
import { EventStoreRepository } from "../infrastructure/event-store.repository";
import { mapStoredEventToWalletEvent } from "./events/wallet-event.mapper";

export class WalletRehydrator {
  constructor(
    private readonly eventStore: EventStoreRepository
  ) {}

  async rehydrate(
    walletId: string,
    userId: string
  ) {
    const storedEvents =
      await this.eventStore.getEvents(walletId);

    const walletEvents = storedEvents.map(
      mapStoredEventToWalletEvent
    );

    return WalletAggregate.rehydrate(
      walletId,
      userId,
      walletEvents
    );
  }
}