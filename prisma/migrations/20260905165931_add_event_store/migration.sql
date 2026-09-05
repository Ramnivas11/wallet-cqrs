-- CreateTable
CREATE TABLE "EventStore" (
    "id" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventVersion" INTEGER NOT NULL,
    "eventData" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventStore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventStore_aggregateId_idx" ON "EventStore"("aggregateId");

-- CreateIndex
CREATE UNIQUE INDEX "EventStore_aggregateId_eventVersion_key" ON "EventStore"("aggregateId", "eventVersion");
