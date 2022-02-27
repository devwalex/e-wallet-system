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

const fundWallet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { amount } = req.body;

    const walletData = {
      amount,
      user: req.user
    }

    const paymentLink = await walletService.fundWallet(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Initialized Wallet Funding",
      paymentLink
    });
  } catch (error) {
    console.error("fundWallet Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const verifyWalletFunding = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res
    //     .status(httpStatus.BAD_REQUEST)
    //     .json({ errors: errors.array() });
    // }

    const { transaction_id, status, tx_ref } = req.query;

    if (!transaction_id || !status || !tx_ref) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: "Could not verify payment",
      });
    }

    const walletData = {
      transaction_id,
      status,
      tx_ref,
      user: req.user
    }

    const payment = await walletService.verifyWalletFunding(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Wallet Funded Successfully",
      payment
    });
  } catch (error) {
    console.error("verifyWalletFunding Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  setWalletPin,
  fundWallet,
  verifyWalletFunding
};
