import express from "express";
import walletRoutes from "./modules/wallet/api/wallet.routes";
import {
  errorHandler,
  notFoundHandler
} from "./infrastructure/middleware/error-handler.middleware";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "wallet-cqrs"
  });
});

app.use("/api/wallet", walletRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Central error handling middleware
app.use(errorHandler);

export default app;