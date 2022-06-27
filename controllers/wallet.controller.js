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

    await walletService.verifyWalletFunding(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Wallet Funded Successfully",
    });
  } catch (error) {
    console.error("verifyWalletFunding Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const transferFund = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const { amount, wallet_code_or_email, wallet_pin } = req.body;

    const walletData = {
      amount,
      wallet_code_or_email,
      wallet_pin,
      user: req.user
    }

    await walletService.transferFund(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Fund Transfer Successful",
    });
  } catch (error) {
    console.error("transferFund Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const withdrawFund = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const { amount, bank_code, account_number, wallet_pin } = req.body;

    const walletData = {
      amount,
      bank_code,
      account_number,
      wallet_pin,
      user: req.user
    }

    await walletService.withdrawFund(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Withdrawal Successful",
    });
  } catch (error) {
    console.error("withdrawFund Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const walletData = {
      user: req.user
    }
    
    const wallet = await walletService.getWalletBalance(walletData);

    return res.status(httpStatus.OK).send({
      success: true,
      message: "Returned wallet balance successfully",
      result: wallet.balance
    });
  } catch (error) {
    console.error("GetWalletBalance Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  setWalletPin,
  fundWallet,
  verifyWalletFunding,
  transferFund,
  withdrawFund,
  getWalletBalance
};
