# Wallet CQRS API

A backend wallet API built with **Node.js, TypeScript, Express, Prisma, and PostgreSQL**, following **CQRS (Command Query Responsibility Segregation)** and **Event Sourcing** principles.

---

## Tech Stack

- **Runtime & Language**: Node.js, TypeScript
- **Web Framework**: Express.js
- **ORM & Database**: Prisma ORM, PostgreSQL
- **Architecture**: CQRS, Event Sourcing, Domain-Driven Design (DDD) principles
- **Dev Tools**: tsx (TypeScript execute & watch)

---

## Architecture & Concepts

The system strictly decouples **Commands (write/mutation side)** from **Queries (read side)**:

### Command Flow (Write Side)
```text
HTTP Request (POST)
       ↓
Wallet Controller
       ↓
Command Handler (e.g., CreateWallet / DepositMoney / WithdrawMoney)
       ↓
Wallet Aggregate (Domain validation & business invariants)
       ↓
Domain Event (e.g., WalletCreated, MoneyDeposited, MoneyWithdrawn)
       ↓
Event Store Repository (PostgreSQL EventStore table)
       ↓
Projection Handler (Updates Read Models asynchronously / synchronously)
```

### Query Flow (Read Side)
```text
HTTP Request (GET)
       ↓
Wallet Controller
       ↓
Query Handler (e.g., GetWalletBalance / GetTransactionHistory)
       ↓
Wallet Read Repository / Projections
       ↓
Optimized Read Model (PostgreSQL WalletReadModel)
```

---

## Features

- **Event Sourced Core**: State transitions recorded as immutable domain events in the `EventStore`.
- **Aggregate Rehydration**: Reconstitutes wallet aggregate state by replaying past domain events.
- **Dedicated Read Projections**: Fast query responses served from dedicated read models (`WalletReadModel`).
- **Comprehensive Wallet Operations**:
  - Wallet creation
  - Deposits (in paise/minor units)
  - Withdrawals (with balance validation & overdraft prevention)
  - Real-time balance retrieval
  - Full transaction history playback
- **Robust Error Handling**: Centralized error middleware with typed HTTP exceptions and detailed responses.
- **Request Validation**: Schema and input sanity checking for IDs, body payloads, and monetary amounts.

---

## Project Structure

```text
.
├── .env.example
├── package.json
├── tsconfig.json
├── prisma/
│   └── schema.prisma
└── src/
    ├── app.ts                                    # Express app configuration & middleware
    ├── server.ts                                 # HTTP server entry point
    ├── infrastructure/
    │   ├── database/
    │   │   └── prisma.ts                         # Prisma client instance
    │   ├── errors/
    │   │   └── app-error.ts                      # Custom application errors
    │   └── middleware/
    │       ├── error-handler.middleware.ts       # Central error handling & 404 handler
    │       └── validation.middleware.ts          # Request validation middleware
    └── modules/
        └── wallet/
            ├── api/
            │   ├── wallet.controller.ts          # HTTP request handlers
            │   └── wallet.routes.ts              # Route definitions
            ├── commands/
            │   ├── create-wallet/                # Command & Handler for wallet creation
            │   ├── deposit-money/                # Command & Handler for depositing funds
            │   └── withdraw-money/               # Command & Handler for withdrawing funds
            ├── domain/
            │   ├── events/                       # Domain events (WalletCreated, etc.)
            │   ├── wallet.aggregate.ts           # Wallet business logic & state
            │   └── wallet-rehydrator.ts          # Aggregate event replayer
            ├── infrastructure/
            │   └── event-store.repository.ts     # Persistence layer for domain events
            ├── projections/
            │   ├── transaction-history.projection.ts
            │   ├── wallet.projection.ts
            │   └── wallet-read.repository.ts     # Read-model access queries
            └── queries/
                ├── get-transaction-history/      # Query & Handler for transaction history
                └── get-wallet-balance/           # Query & Handler for balance inquiry
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (local instance or Docker container)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Ramnivas11/wallet-cqrs.git
cd wallet-cqrs
npm install
```

### 2. Configure Environment

Copy the example environment template:

```bash
cp .env.example .env
```

Edit `.env` to configure your database connection string and server port:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wallet_cqrs?schema=public"
```

### 3. Run Database Migrations

Apply the Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
```

### 4. Start the Application

**Development Mode (live reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

The server will start listening at: `http://localhost:3000`

---

## API Endpoints

### 1. Health Check

```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "wallet-cqrs"
}
```

---

### 2. Create Wallet

Initialize a new wallet for a user.

```http
POST /api/wallet
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "usr_12345"
}
```

**Response (201 Created):**
```json
{
  "message": "Wallet created successfully",
  "data": {
    "walletId": "b18b45f4-...",
    "userId": "usr_12345",
    "balance": 0
  }
}
```

---

### 3. Deposit Money

Deposit funds into a wallet. Amounts are represented as positive integers in paise (e.g., `5000` = ₹50.00).

```http
POST /api/wallet/:id/deposit
Content-Type: application/json
```
*(Also supports `POST /api/wallet/deposit` with `walletId` in the body)*

**Request Body:**
```json
{
  "amountInPaise": 5000
}
```

**Response (200 OK):**
```json
{
  "message": "Money deposited successfully",
  "data": {
    "walletId": "b18b45f4-...",
    "balance": 5000
  }
}
```

---

### 4. Withdraw Money

Withdraw funds from a wallet. Returns an error if the balance is insufficient.

```http
POST /api/wallet/:id/withdraw
Content-Type: application/json
```
*(Also supports `POST /api/wallet/withdraw` with `walletId` in the body)*

**Request Body:**
```json
{
  "amountInPaise": 2000
}
```

**Response (200 OK):**
```json
{
  "message": "Money withdrawn successfully",
  "data": {
    "walletId": "b18b45f4-...",
    "balance": 3000
  }
}
```

---

### 5. Get Wallet Balance

Query the current balance from the read model.

```http
GET /api/wallet/:id
```
*(Alternative alias: `GET /api/wallet/:id/balance`)*

**Response (200 OK):**
```json
{
  "message": "Wallet fetched successfully",
  "data": {
    "walletId": "b18b45f4-...",
    "userId": "usr_12345",
    "balance": 3000
  }
}
```

---

### 6. Get Transaction History

Retrieve all past transactions and domain events recorded for the wallet.

```http
GET /api/wallet/:id/transactions
```
*(Alternative alias: `GET /api/wallet/:id/history`)*

**Response (200 OK):**
```json
{
  "message": "Transaction history fetched successfully",
  "data": [
    {
      "eventType": "WalletCreated",
      "eventData": { "userId": "usr_12345" },
      "occurredAt": "2026-10-13T12:00:00.000Z"
    },
    {
      "eventType": "MoneyDeposited",
      "eventData": { "amountInPaise": 5000 },
      "occurredAt": "2026-10-13T12:05:00.000Z"
    },
    {
      "eventType": "MoneyWithdrawn",
      "eventData": { "amountInPaise": 2000 },
      "occurredAt": "2026-10-13T12:10:00.000Z"
    }
  ]
}
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `tsx watch src/server.ts` | Runs the server in development mode with hot reloading |
| `npm run build` | `tsc` | Transpiles TypeScript files to JavaScript in `/dist` |
| `npm start` | `node dist/server.js` | Runs the transpiled production build |

---

## License

ISC
