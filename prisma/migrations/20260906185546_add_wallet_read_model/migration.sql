-- CreateTable
CREATE TABLE "WalletReadModel" (
    "walletId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletReadModel_pkey" PRIMARY KEY ("walletId")
);
