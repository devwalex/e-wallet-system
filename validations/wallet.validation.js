const { check } = require("express-validator");

const setWalletPin = [
  check("pin", "Pin is required")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 4 })
    .withMessage("Pin must contain only 4 numbers")
    .isNumeric()
    .withMessage("Pin must contain only numbers"),
  check("confirm_pin", "Confirm pin is required")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 4 })
    .withMessage("Confirm pin must contain only 4 numbers")
    .isNumeric()
    .withMessage("Confirm pin must contain only numbers")
    .custom((value, { req }) => {
      if (value !== req.body.pin) {
        return Promise.reject("confirm pin must be the same as pin");
      } else {
        return true;
      }
    }),
];

module.exports = {
  setWalletPin,
};