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
        return Promise.reject(new Error("confirm pin must be the same as pin"));
      } else {
        return Promise.resolve(true);
      }
    }),
];

const fundWallet = [
  check("amount", "Amount is required")
    .not()
    .isEmpty()
    .isCurrency()
    .withMessage("Please enter a valid amount"),
  check("frontend_base_url")
    .isURL()
    .optional()
];

const transferFund = [
  check("amount", "Amount is required")
    .not()
    .isEmpty()
    .isCurrency()
    .withMessage("Please enter a valid amount"),
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
    .withMessage("Please enter a valid amount"),
    check("bank_code", "Please select a bank")
    .not()
    .isEmpty(),
    check("account_number", "Account number is required")
    .not()
    .isEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage("Account number contain only 10 numbers"),
    check("wallet_pin", "Wallet pin is required")
    .not()
    .isEmpty()
];

const resolveBankAccount = [
    check("bank_code", "Please select a bank")
    .not()
    .isEmpty(),
    check("account_number", "Account number is required")
    .not()
    .isEmpty()
    .isLength({ min: 10, max: 10 })
    .withMessage("Account number contain only 10 numbers"),
];

module.exports = {
  setWalletPin,
  fundWallet,
  transferFund,
  withdrawFund,
  resolveBankAccount
};
