import express from "express";
import walletRoutes from "./modules/wallet/api/wallet.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "wallet-cqrs"
  });
});

app.use("/api/wallet", walletRoutes);

export default app;