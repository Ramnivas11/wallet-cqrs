import { Router } from "express";
import { WalletController } from "./wallet.controller";

const router = Router();
const walletController = new WalletController();

router.post("/", (req, res) => walletController.createWallet(req, res));

export default router;
