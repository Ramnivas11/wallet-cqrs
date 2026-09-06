# Wallet CQRS API

A backend wallet API built with **Node.js, TypeScript, Express, Prisma, and PostgreSQL**, following **CQRS and event-driven architecture** principles.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- CQRS / Event-Driven Architecture

## Architecture

The project separates HTTP handling, application logic, domain logic, and persistence:

```text
HTTP Request
     ↓
Controller
     ↓
Command Handler
     ↓
Wallet Aggregate
     ↓
Domain Event
     ↓
Event Store
     ↓
PostgreSQL
```

## Current Features

- Create a wallet
- Wallet aggregate and domain events
- Event store persistence
- Prisma/PostgreSQL integration
- Health check endpoint
- TypeScript strict mode

## Project Structure

```text
src/
├── infrastructure/
│   └── database/
│       └── prisma.ts
│
├── modules/
│   └── wallet/
│       ├── api/
│       ├── commands/
│       ├── domain/
│       └── infrastructure/
│
├── app.ts
└── server.ts

prisma/
└── schema.prisma
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wallet_cqrs?schema=public"
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## API

### Health Check

```http
GET /health
```

### Create Wallet

```http
POST /api/wallet
Content-Type: application/json
```

Request:

```json
{
  "userId": "user-id"
}
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Compile TypeScript
npm start        # Start compiled application
```

## Status

This project is currently a **CQRS/event-driven architecture foundation**. Wallet creation and event persistence are implemented, while additional wallet operations such as deposits, withdrawals, transfers, and queries can be added as the project evolves.
