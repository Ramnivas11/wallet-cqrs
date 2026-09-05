import { prisma } from "../../../infrastructure/database/prisma";

export interface AppendEventInput {
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  eventVersion: number;
  eventData: object;
}

export class EventStoreRepository {
  async append(event: AppendEventInput) {
    return prisma.eventStore.create({
      data: {
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        eventData: event.eventData,
      },
    });
  }

  async getEvents(aggregateId: string) {
    return prisma.eventStore.findMany({
      where: {
        aggregateId,
      },
      orderBy: {
        eventVersion: "asc",
      },
    });
  }
}
