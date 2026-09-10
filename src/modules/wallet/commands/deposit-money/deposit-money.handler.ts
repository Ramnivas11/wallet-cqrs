import { DepositMoneyCommand } from "./deposit-money.command";
import { EventStoreRepository } from "../../infrastructure/event-store.repository";
import { WalletReadRepository } from "../../projections/wallet-read.repository";
import { WalletAggregate } from "../../domain/wallet.aggregate";
import { mapStoredEventToWalletEvent } from "../../domain/events/wallet-event.mapper";

export class DepositMoneyHandler {
  constructor(
    private readonly eventStore: EventStoreRepository,
    private readonly walletReadRepository: WalletReadRepository
  ) {}

  async execute(command: DepositMoneyCommand) {
    const walletReadModel =
      await this.walletReadRepository.findById(
        command.walletId
      );

    if (!walletReadModel) {
      throw new Error("Wallet not found");
    }

    const storedEvents =
      await this.eventStore.getEvents(
        command.walletId
      );

    const walletEvents = storedEvents.map(
      mapStoredEventToWalletEvent
    );

    const wallet = WalletAggregate.rehydrate(
      command.walletId,
      walletReadModel.userId,
      walletEvents
    );

    wallet.deposit(command.amountInPaise);

    const events = wallet.getUncommittedEvents();

    for (const event of events) {
      await this.eventStore.append({
        aggregateId: command.walletId,
        aggregateType: "Wallet",
        eventType: event.type,
        eventVersion: wallet.getVersion(),
        eventData: event.data
      });
    }

    await this.walletReadRepository.updateBalance(
      command.walletId,
      wallet.getBalance(),
      wallet.getVersion()
    );

    return {
      walletId: command.walletId,
      balanceInPaise: wallet.getBalance()
    };
  }
}