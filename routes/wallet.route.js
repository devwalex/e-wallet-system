const express = require("express");
const walletController = require("../controllers/wallet.controller");
const { walletValidation } = require('../validations');
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/wallet/set-pin", [auth, walletValidation.setWalletPin], walletController.setWalletPin);
// router.post('/login',  userValidation.login,  walletController.login);

module.exports = router;
