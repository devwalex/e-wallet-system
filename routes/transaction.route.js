const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.get("/transactions", [auth], transactionController.getTransactions);

module.exports = router;
