const { walletService } = require("../services");
const httpStatus = require("http-status");
const { validationResult } = require("express-validator");
const catchAsync = require("../utils/catchasync");
const BadRequestError = require("../utils/errors/badrequest.error");

const setWalletPin = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, errors: errors.array() });
  }

  const { pin } = req.body;

  const walletData = {
    pin,
    user: req.user,
  };

  await walletService.setWalletPin(walletData);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: "Set pin successfully!",
  });
});

const fundWallet = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, errors: errors.array() });
  }

  const { amount, frontend_base_url } = req.body;

  const walletData = {
    amount,
    user: req.user,
    frontend_base_url,
  };

  const paymentLink = await walletService.fundWallet(walletData);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: "Initialized Wallet Funding",
    paymentLink,
  });
});

const verifyWalletFunding = catchAsync(async (req, res) => {
  const { transaction_id, status, tx_ref } = req.query;

  if (!transaction_id || !status || !tx_ref) {
    throw new BadRequestError("Could not verify payment");
  }

  const walletData = {
    transaction_id,
    status,
    tx_ref,
    user: req.user,
  };

  await walletService.verifyWalletFunding(walletData);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: "Wallet Funded Successfully",
  });
});

const transferFund = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, errors: errors.array() });
  }
  const { amount, wallet_code_or_email, wallet_pin } = req.body;

  const walletData = {
    amount,
    wallet_code_or_email,
    wallet_pin,
    user: req.user,
  };

  await walletService.transferFund(walletData);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: "Fund Transfer Successful",
  });
});

const withdrawFund = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, errors: errors.array() });
  }
  const { amount, bank_code, account_number, wallet_pin } = req.body;

  const walletData = {
    amount,
    bank_code,
    account_number,
    wallet_pin,
    user: req.user,
  };

  await walletService.withdrawFund(walletData);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: "Withdrawal Successful",
  });
});

const getWalletBalance = catchAsync(async (req, res) => {
  const walletData = {
    user: req.user,
  };

  const wallet = await walletService.getWalletBalance(walletData);

  return res.status(httpStatus.OK).send({
    success: true,
    message: "Returned wallet balance successfully",
    result: wallet.balance,
  });
});

const getBanks = catchAsync(async (req, res) => {
  const banks = walletService.getBanks();

  return res.status(httpStatus.OK).send({
    success: true,
    message: "Returned banks successfully",
    result: banks,
  });
});

module.exports = {
  setWalletPin,
  fundWallet,
  verifyWalletFunding,
  transferFund,
  withdrawFund,
  getWalletBalance,
  getBanks,
};
