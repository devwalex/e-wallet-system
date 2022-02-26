const { walletService } = require("../services");
const httpStatus = require("http-status");
const { validationResult } = require("express-validator");

const setWalletPin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { pin } = req.body;

    const walletData = {
      pin,
      user: req.user
    }

    await walletService.setWalletPin(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Set pin successfully!",
    });
  } catch (error) {
    console.error("SetWalletPin Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  setWalletPin,
};
