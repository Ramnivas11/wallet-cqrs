import { Router } from "express";
import { WalletController } from "./wallet.controller";

const router = Router();
const walletController = new WalletController();

router.post("/", (req, res) => walletController.createWallet(req, res));
router.post("/:id/deposit", (req, res) => walletController.depositMoney(req, res));
router.post("/:id/withdraw", (req, res) => walletController.withdrawMoney(req, res));
router.post("/deposit", (req, res) => walletController.depositMoney(req, res));
router.post("/withdraw", (req, res) => walletController.withdrawMoney(req, res));

export default router;
