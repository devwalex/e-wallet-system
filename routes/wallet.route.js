const express = require("express");
const walletController = require("../controllers/wallet.controller");
const { walletValidation } = require('../validations');
const { auth } = require("../middlewares/auth");
const { setWalletPin } = require("../middlewares/set-wallet-pin");

const router = express.Router();

router.post("/wallet/set-pin", [auth, walletValidation.setWalletPin], walletController.setWalletPin);
router.post("/wallet/fund", [auth, setWalletPin, walletValidation.fundWallet], walletController.fundWallet);
router.get("/wallet/verify", [auth, setWalletPin], walletController.verifyWalletFunding);
router.post("/wallet/transfer", [auth, setWalletPin, walletValidation.transferFund], walletController.transferFund);
router.post("/wallet/withdraw", [auth, setWalletPin, walletValidation.withdrawFund], walletController.withdrawFund);
router.get("/wallet/balance", [auth, setWalletPin], walletController.getWalletBalance);
router.get("/wallet/banks", [auth, setWalletPin], walletController.getBanks);

module.exports = router;
