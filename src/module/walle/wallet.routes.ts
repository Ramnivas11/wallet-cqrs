import { Router } from "express";
import { WalletController } from "./wallet.controller";

const router = Router();

const walletController = new WalletController();

router.post("/", walletController.createWallet);

export default router;