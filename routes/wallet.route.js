const express = require("express");
const walletController = require("../controllers/wallet.controller");
const { walletValidation } = require('../validations');
const { auth } = require("../middlewares/auth");
const { setWalletPin } = require("../middlewares/set-wallet-pin");

const router = express.Router();

router.post("/wallet/set-pin", [auth, walletValidation.setWalletPin], walletController.setWalletPin);
router.post("/wallet/fund", [auth, setWalletPin, walletValidation.fundWallet], walletController.fundWallet);
router.get("/wallet/verify", [auth, setWalletPin], walletController.verifyWalletFunding);

module.exports = router;
