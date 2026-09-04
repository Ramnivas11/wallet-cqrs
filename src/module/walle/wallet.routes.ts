import { Router } from "express";
import { WalletController } from "./wallet.controller";

const router = Router();

const walletController = new WalletController();

router.post("/", walletController.createWallet);
router.get("/:id", walletController.getWallet);

export default router;