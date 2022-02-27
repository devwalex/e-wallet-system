const { check } = require("express-validator");

const setWalletPin = [
  check("pin", "Pin is required")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 4 })
    .withMessage("Pin must contain only 4 numbers")
    .isInt()
    .withMessage("Pin must contain only numbers"),
  check("confirm_pin", "Confirm pin is required")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 4 })
    .withMessage("Confirm pin must contain only 4 numbers")
    .isInt()
    .withMessage("Confirm pin must contain only numbers")
    .custom((value, { req }) => {
      if (value !== req.body.pin) {
        return Promise.reject("confirm pin must be the same as pin");
      } else {
        return true;
      }
    }),
];

const fundWallet = [
  check("amount", "Amount is required")
    .not()
    .isEmpty()
    .isCurrency()
    .withMessage("amount must be a currency"),
];

const transferFund = [
  check("amount", "Amount is required")
    .not()
    .isEmpty()
    .isCurrency()
    .withMessage("amount must be a currency"),
    check("wallet_code_or_email", "Please provide either recipient wallet code or email")
    .not()
    .isEmpty(),
    check("wallet_pin", "Wallet pin is required")
    .not()
    .isEmpty()
];

const withdrawFund = [
  check("amount", "Amount is required")
    .not()
    .isEmpty()
    .isCurrency()
    .withMessage("amount must be a currency"),
    check("bank_code", "Bank code is required")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 3 })
    .withMessage("Bank code contain only 3 numbers"),
    check("account_number", "Bank code is required")
    .not()
    .isEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage("Account number contain only 10 numbers"),
    check("wallet_pin", "Wallet pin is required")
    .not()
    .isEmpty()
];

module.exports = {
  setWalletPin,
  fundWallet,
  transferFund,
  withdrawFund
};
